package controllers

import cats.syntax.either._
import com.gu.editorial.permissions.client.{Permission, PermissionGranted, PermissionsUser}
import com.gu.pandomainauth.action.UserRequest
import config.Config
import db.AtomDataStores._
import db.AtomWorkshopDBAPI
import play.api.libs.concurrent.Execution.Implicits._
import models._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc.{ActionBuilder, Controller, Request, Result}

import services.AtomPublishers._
import services.AtomWorkshopPermissionsProvider
import util.AtomLogic._
import util.AtomUpdateOperations._
import util.AtomElementBuilders
import play.api.mvc.Action

import com.gu.contentapi.client.model.AtomsQuery
import com.gu.contentapi.client.model.v1.AtomsResponse
import com.gu.contentapi.client.GuardianContentClient
import com.gu.contentatom.thrift.{AtomType, AtomData}
import com.gu.pandomainauth.model.{User => PandaUser}

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration

class Migration(
  val wsClient: WSClient, 
  val capiClient: GuardianContentClient,
  val atomWorkshopDB: AtomWorkshopDBAPI) 
  extends Controller with PanDomainAuthActions {
  
  def migrateExplainers() = AuthAction { req =>
    Await.result(unfoldM(migrate(req.user, 1)), Duration.Inf)
    Ok("Done!")
  }

  // Here's how it works:
  // - query CAPI for all live explainers
  // - insert each result in the DynamoDB preview and live stores
  private def migrate(user: PandaUser)(pageNo: Int): Future[Unit] =
    queryCapi(pageNo)
      .flatMap(insertIntoDynamo(user))
      .flatMap { totalPages: Int =>
        if (pageNo < totalPages)
          migrate(user)(pageNo + 1)
        else
          Future.successful(())
      }

  // Ask CAPI for a page of explainer atoms
  private def queryCapi(pageNo: Int): Future[AtomsResponse] = {
    val query = AtomsQuery().types("explainer").page(pageNo)
    capiClient.getResponse(query)
  }

  // Publish atoms in the atom workshop datastores
  private def insertIntoDynamo(user: PandaUser)(ar: AtomsResponse): Future[Int] = {
    for {
      result <- ar.results
    } yield {
      val atomFields = CreateAtomFields(
        title = result.data match {
          case a: AtomData.Explainer => Some(a.explainer.title)
          case _ => None
        },
        defaultHtml = Some(result.defaultHtml),
        commissioningDesks = result.commissioningDesks
      )
      val atomToCreate = AtomElementBuilders.buildDefaultAtom(AtomType.Explainer, user, Some(atomFields))
      for {
        atom <- atomWorkshopDB.createAtom(previewDataStore, AtomType.Explainer, user, atomToCreate)
        updatedAtom <- atomWorkshopDB.publishAtom(publishedDataStore, user, updateTopLevelFields(atom, user, publish=true))
        _ <- atomWorkshopDB.updateAtom(previewDataStore, updatedAtom)
      } yield ()
    }
    
    Future.successful(ar.pages)
  }
}
