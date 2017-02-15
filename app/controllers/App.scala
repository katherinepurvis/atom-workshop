package controllers

import config.Config
import models._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import cats.syntax.either._
import com.gu.contentatom.thrift.Atom
import db.{AtomDataStores, AtomWorkshopDBAPI}
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.syntax._
import io.circe._
import io.circe.generic.auto._
import util.AtomLogic._

class App(val wsClient: WSClient, val atomWorkshopDB: AtomWorkshopDBAPI) extends Controller with PanDomainAuthActions {

  def index(placeholder: String) = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")

    val clientConfig = ClientConfig(
      username = req.user.email
    )

    val jsFileName = "build/app.js"

    val jsLocation = sys.env.get("JS_ASSET_HOST").map(_ + jsFileName)
      .getOrElse(routes.Assets.versioned(jsFileName).toString)


    Ok(views.html.index("AtomMcAtomFace", jsLocation, clientConfig.asJson.noSpaces))
  }

  def getAtom(atomType: String, id: String, version: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, getVersion(version))
        atom <- atomWorkshopDB.getAtom(ds, atomType, id)
      } yield atom
    }
  }

  def createAtom(atomType: String) = AuthAction { req =>
    APIResponse{
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, Preview)
        atom <- atomWorkshopDB.createAtom(ds, atomType, req.user)
      } yield atom
    }
  }

  def updateEntireAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        payload <- extractRequestBody(req.body.asText)
        newAtom <- parseAtomJson(payload)
        datastore <- AtomDataStores.getDataStore(atomType, Preview)
        currentAtom <- atomWorkshopDB.getAtom(datastore, atomType, id)
        result <- atomWorkshopDB.updateAtom(datastore, atomType, req.user, currentAtom,newAtom)
      } yield AtomWorkshopAPIResponse(s"Update of atom of type $atomType with id $id successful.")
    }
  }

  def deleteAtom(atomType: String, id: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        liveDataStore <- AtomDataStores.getDataStore(atomType, getVersion("live"))
        liveAtom = atomWorkshopDB.getAtom(liveDataStore, atomType, id)
        _ <- checkAtomCanBeDeletedFromPreview(liveAtom)
        previewDataStore <- AtomDataStores.getDataStore(atomType, getVersion("preview"))
        result <- atomWorkshopDB.deleteAtom(previewDataStore, atomType, id)
      } yield AtomWorkshopAPIResponse("Atom deleted from preview")
    }
  }

  def takedownAtom(atomType: String, id: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, getVersion("live"))
        result <- atomWorkshopDB.deleteAtom(ds, atomType, id)
      } yield AtomWorkshopAPIResponse("Atom taken down")
    }
  }

}
