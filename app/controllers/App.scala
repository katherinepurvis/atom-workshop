package controllers

import com.gu.atom.data.{DynamoCompositeKey, PreviewDataStore}
import com.gu.contentatom.thrift.{ContentChangeDetails, Flags, Atom, AtomData}
import config.Config
import model.ClientConfig
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.libs.json.Json
import play.api.mvc._
import cats.syntax.either._

case class MyAtom
(
  id: String,
  labels: Seq[String],
  defaultHtml: Option[String],
  contentChangeDetails: MyContentChangeDetails,
  flags: Option[MyFlags]
)

case class MyContentChangeDetails
(
  lastModified: Option[MyChangeRecord],
  created: Option[MyChangeRecord],
  published: Option[MyChangeRecord],
  revision: Long
)

case class MyChangeRecord(user: MyUser, date: Long)

case class MyUser
(
  email: String,
  firstName: Option[String],
  lastName: Option[String]
)

case class MyFlags(legallySensitive: Boolean)

class App(val wsClient: WSClient, previewDataStore: PreviewDataStore) extends Controller with PanDomainAuthActions {
  import util.ClassToMap._, util.MapToClass._
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

  def updateNestedMap(map: Map[String, Any], value: Any, path: List[String]): Map[String, Any] = path match {
    case key :: Nil => map.updated(key, value)
    case key :: tail =>
      map(key) match {
        case None => map.updated(key, Some(updateNestedMap(Map(), value, tail)))
        case optionMap: Option[Map[String, Any]] => map.updated(key, Some(updateNestedMap(optionMap.get, value, tail)))
        case simpleMap: Map[String, Any] => map.updated(key, updateNestedMap(simpleMap, value, tail))
        case somethingElse => throw new UnsupportedOperationException(s"Unexpected type found during update: $somethingElse")
      }
  }

  def update(atomType: String, id: String, field: String) = Action { req =>
    previewDataStore.getAtom(DynamoCompositeKey("Media", Some("8ba4c6c8-0815-45d9-9e87-0a6c20954094"))).fold(
      err => {
        println(err.msg)
        err.msg
      },
      atom => {
        val fields = field.split('.').toList

        val newAtom = MyAtom(
          id = atom.id,
          labels = atom.labels,
          defaultHtml = Some(atom.defaultHtml),
          flags = Some(MyFlags(legallySensitive = atom.flags.get.legallySensitive.get)),
          contentChangeDetails = MyContentChangeDetails(
            lastModified = Some(MyChangeRecord(
              user = MyUser(email = "email@gu.com", firstName = Some("first"), lastName = Some("last")),
              date = atom.contentChangeDetails.lastModified.fold(0L)(_.date))),
            created = None,
            published = None,
            revision = atom.contentChangeDetails.revision
          ))

//        val mapAtom = atom.asInstanceOf[Atom.Immutable].toMap
        val mapAtom = newAtom.contentChangeDetails.toMap
        println("\n====> map atom", mapAtom)

        // Careful to pass the correct type, otherwise it won't find the field and return None.
//        val updatedMapAtom = updateNestedMap(mapAtom, "<<<UPDATED STRING>>>", fields)
//        println("\n====> updated map atom", updatedMapAtom)

//        val backToAtom = to[Atom.Immutable].from(updatedMapAtom)
//        val backToAtom = to[MyAtom].from(updatedMapAtom)
//        println("\n====> updated atom", backToAtom)
      }
    )
    Ok("ok")
  }
}
