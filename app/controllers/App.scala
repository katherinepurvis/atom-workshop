package controllers

import com.gu.atom.data.{DynamoCompositeKey, DynamoDataStore, PreviewDataStore}
import com.gu.contentatom.thrift.{Atom, AtomData, AtomType, ContentChangeDetails}
import com.gu.contentatom.thrift.AtomData.Media
import config.Config
import models._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.libs.json.Json
import play.api.mvc._
import com.gu.contentatom.thrift.atom.media._
import cats.syntax.either._
import data.AtomDataStores
import cats.syntax.either._
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.{DisplayType, ExplainerAtom}

class App(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  def index = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")

    val clientConfig = ClientConfig(
      username = req.user.email
    )

    Ok(views.html.index("Atomyatomatom", Json.toJson(clientConfig).toString()))
  }

  def getVersion(version: String): Version = version match {
    case "preview" => Preview
    case "live" => Live
  }

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

  def buildKey(atomType: AtomType, id: String) = DynamoCompositeKey(atomType.name, Some(id))

  def getAtom(atomType: String, id: String, version: String) = AuthAction {
    val atomRes = for {
      atomType <- validateAtomType(atomType)
      ds <- AtomDataStores.getDataStore(atomType, getVersion(version))
    } yield {
      ds.getAtom(buildKey(atomType, id)).fold(err => {
        Logger.error(s"Failed to get atom with type ${atomType.name} and id $id. Error message: ${err.msg}")
        NotFound(err.msg)
      }, atom => Ok(atom.toString()))
    }
    atomRes.fold(err => BadRequest(err.msg), atom => atom)

  }

  def createAtom(atomType: String) = AuthAction {

    Logger.info(s"Attempting to create atom with type $atomType")

    def buildDefaultAtom(atomType: AtomType) = {
      val defaultAtoms: Map[AtomType, AtomData] = Map(
        AtomType.Explainer -> AtomData.Explainer(ExplainerAtom("", "", DisplayType.Flat)),
        AtomType.Cta -> AtomData.Cta(CTAAtom(""))
      )

      Atom(id = java.util.UUID.randomUUID.toString,
        atomType = atomType,
        defaultHtml = s"""<div class="atom-${atomType.name}"></div>""",
        data = defaultAtoms(atomType),
        contentChangeDetails = ContentChangeDetails(revision = 0L))
    }

    val res = for {
      atomType <- validateAtomType(atomType)
      ds <- AtomDataStores.getDataStore(atomType, Preview)
    } yield {
      val defaultAtom = buildDefaultAtom(atomType)
      Logger.info(s"Attempting to create atom of type ${atomType.name} with id ${defaultAtom.id}")
      ds.createAtom(defaultAtom)
    }

    res.fold(err => BadRequest(err.msg), r => r.fold(err => InternalServerError(err.msg), a => Ok("Atom succesfully created.")))
  }

}
