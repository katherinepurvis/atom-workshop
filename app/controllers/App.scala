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
import util.Atoms._
import io.circe._
import io.circe.generic.auto._

class App(val wsClient: WSClient, val atomWorkshopDB: AtomWorkshopDBAPI) extends Controller with PanDomainAuthActions {

  def index = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")

    val clientConfig = ClientConfig(
      username = req.user.email
    )

    Ok(views.html.index("AtomMcAtomFace", clientConfig.asJson.noSpaces))
  }

  def getAtom(atomType: String, id: String, version: String) = Action {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, getVersion(version))
        atom <- atomWorkshopDB.getAtom(ds, atomType, id)
      } yield atom
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
