package controllers

import com.gu.atom.data.{DynamoCompositeKey, PreviewDataStore}
import com.gu.contentatom.thrift.AtomData
import config.Config
import model.ClientConfig
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.libs.json.Json
import play.api.mvc._
import cats.syntax.either._
import shapeless._, ops.record.Selector, record._, syntax.singleton._
import shapeless.ops.record._

class App(val wsClient: WSClient, previewDataStore: PreviewDataStore) extends Controller with PanDomainAuthActions {

  def index = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")

    val someAtom = previewDataStore.getAtom(DynamoCompositeKey("Media", Some("8ba4c6c8-0815-45d9-9e87-0a6c20954094"))).fold(
      err => err.msg,
      atom => atom.data.asInstanceOf[AtomData.Media].media.title
    )

    val clientConfig = ClientConfig(
      username = req.user.email
    )

    Ok(views.html.index(someAtom, Json.toJson(clientConfig).toString()))
  }

  case class Atom( id: String,
                   labels: Seq[String],
                   defaultHtml: String,
                   contentChangeDetails: ContentChangeDetails)

  case class ContentChangeDetails( lastModified: Option[ChangeRecord],
                                   revision: Long)

  case class ChangeRecord(date: Long)


  def update(atomType: String, id: String, field: String) = Action { req =>
    previewDataStore.getAtom(DynamoCompositeKey("Media", Some("8ba4c6c8-0815-45d9-9e87-0a6c20954094"))).fold(
      err => err.msg,
      atom => {
        val fields = field.split('.').toList
        val firstLevel = fields.head

        val newAtom = Atom(
          id = atom.id,
          labels = atom.labels,
          defaultHtml = atom.defaultHtml,
          contentChangeDetails = ContentChangeDetails(
            lastModified = Some(ChangeRecord(atom.contentChangeDetails.lastModified.fold(0L)(_.date))),
            revision = atom.contentChangeDetails.revision
          ))

        val atomLabelledGeneric = LabelledGeneric[Atom]

        val shapelessAtom = atomLabelledGeneric.from(atomLabelledGeneric.to(newAtom) + (Symbol("id") ->> "new id"))
        println("====> Generated shapeless atom with update", shapelessAtom)

        val keys = Keys[atomLabelledGeneric.Repr].apply
        println("====> Generated shapeless labelled atom", keys.toList)

      }
    )
    Ok("ok")
  }
}
