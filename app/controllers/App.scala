package controllers

import config.Config
import models._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import cats.syntax.either._
import com.gu.contentatom.thrift.Atom
import db.{AtomDataStores, AtomWorkshopDBAPI}
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.syntax._
import util.HelperFunctions._

class App(val wsClient: WSClient, val atomWorkshopDB: AtomWorkshopDBAPI) extends Controller with PanDomainAuthActions {

  def index = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")

    val clientConfig = ClientConfig(
      username = req.user.email
    )

    Ok(views.html.index("AtomMcAtomFace", clientConfig.asJson.noSpaces))
  }

  private def getAtomFromDataStore(atomType: String, id: String, version: String): Either[AtomAPIError, Atom] =
    for {
      atomType <- validateAtomType(atomType)
      ds <- AtomDataStores.getDataStore(atomType, getVersion(version))
      atom <- atomWorkshopDB.getAtom(ds, atomType, id)
    } yield atom

  def getAtom(atomType: String, id: String, version: String) = AuthAction {
    APIResponse {
      getAtomFromDataStore(atomType, id, version)
    }
  }

  def createAtom(atomType: String) = AuthAction {
    APIResponse{
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, Preview)
        result <- atomWorkshopDB.createAtom(ds, atomType)
      } yield AtomWorkshopAPIResponse("Atom creation successful")
    }
  }

  private def deleteAtomFromDataStore(atomType: String, id: String, version: String): Either[AtomAPIError, Unit] =
    for {
      atomType <- validateAtomType(atomType)
      ds <- AtomDataStores.getDataStore(atomType, getVersion(version))
      result <- atomWorkshopDB.deleteAtom(ds, atomType, id)
    } yield result

  def deleteAtom(atomType: String, id: String) = AuthAction {
    val atomIsLive = getAtomFromDataStore(atomType, id, "live").fold(_ => false, _ => true)
    APIResponse {
      if (atomIsLive)
        deleteAtomFromDataStore(atomType, id, "preview")
      else Left(DeleteAtomFromPreviewError)
    }
  }

  def takedownAtom(atomType: String, id: String) = AuthAction {
    APIResponse {
      deleteAtomFromDataStore(atomType, id, "live")
    }
  }

}
