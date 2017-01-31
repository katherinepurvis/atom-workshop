package controllers

import config.Config
import models._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import cats.syntax.either._
import com.gu.fezziwig.CirceScroogeMacros._
import db.{AtomDataStores, AtomWorkshopDB}
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import util.HelperFunctions._

class App(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  def index = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")

    val clientConfig = ClientConfig(
      username = req.user.email
    )

    Ok(views.html.index("AtomMcAtomFace", clientConfig.asJson.noSpaces))
  }

  def getAtom(atomType: String, id: String, version: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, getVersion(version))
        atom <- ds.getAtom(AtomWorkshopDB.buildKey(atomType, id))
      } yield atom
    }
  }

  def createAtom(atomType: String) = AuthAction {
    APIResponse{
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, Preview)
        result <- AtomWorkshopDB.createAtom(ds, atomType)
      } yield AtomWorkshopAPIResponse("Atom creation successful")
    }
  }

}
