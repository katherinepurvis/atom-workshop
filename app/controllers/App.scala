package controllers

import com.gu.atom.data.{DynamoCompositeKey, PreviewDataStore}
import com.gu.contentatom.thrift._
import config.Config
import model.ClientConfig
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.libs.json.Json
import play.api.mvc._
import cats.syntax.either._
import util.Copier

import scala.reflect.ClassTag
import scala.reflect.runtime.{universe => ru}
import scala.util.Try

// From: http://jayconrod.com/posts/32/convenient-updates-for-immutable-objects-in-scala
trait Copying[T] {
  def copyWith(changes: (String, AnyRef)*): T = {
    val clas = getClass
    val constructor = clas.getDeclaredConstructors.head
    val argumentCount = constructor.getParameterTypes.size
    val fields = clas.getDeclaredFields
    val arguments = (0 until argumentCount) map { i =>
      val fieldName = fields(i).getName
      changes.find(_._1 == fieldName) match {
        case Some(change) => change._2
        case None =>
          val getter = clas.getMethod(fieldName)
          getter.invoke(this)
      }
    }
    constructor.newInstance(arguments: _*).asInstanceOf[T]
  }
}

object AnyTrait {
  implicit def innerObj[T](o: MixClass[T]):T = o.obj

  def ::[T](o: T) = new MixClass(o)
  final class MixClass[T] private[AnyTrait](val obj: T) extends Copying[T]
}

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

  case class AtomUpdate(atomType: AtomType, id: String, field:String, value: String)

  def updateField(atom:Atom, field: String, value: String) = {

    def getLevel[T: ClassTag, U: ru.TypeTag](currentLevel: T, node: String) = {

      currentLevel.getClass
      val runtimeMirror = ru.runtimeMirror(currentLevel.getClass.getClassLoader)

      val nodeSymbol = ru.typeOf[U].decl(ru.TermName(node)).asMethod


      println(nodeSymbol)


      val im = runtimeMirror.reflect[T](currentLevel)
      println(im)
      val nodeMirror = im.reflectMethod(nodeSymbol)

      nodeMirror()
    }

    if (field.contains(".")) {
//      val fieldList = field.split(".")
//      val lastField = fieldList.last
//      val nodes = fieldList.init

      val levels = List(atom)
      def getTypeTag[T: ru.TypeTag](obj: T) = ru.typeTag[T]
      val theType = ru.typeOf(getTypeTag(atom))
      val ccd = getLevel[Atom, Atom](atom, "contentChangeDetails").asInstanceOf[ContentChangeDetails]
      val lm = getLevel[ContentChangeDetails, ContentChangeDetails](ccd, "lastModified").asInstanceOf[Option[ChangeRecord]]
      val updatedLm = Copier(lm.get, ("date", 5))
      println(lm)
      println(updatedLm)

      println("doing final copy")
      val lalala = Copier(atom, ("contentChangeDetails", Copier(ccd, ("lastModified", Some(updatedLm)))))
      println(lalala)
    }

    val m = ru.runtimeMirror(atom.getClass.getClassLoader)
    val defaultHtmlSymb = ru.typeOf[Atom].decl(ru.TermName("defaultHtml")).asMethod
    val im = m.reflect(atom)
    val defaultHtmlMirror = im.reflectMethod(defaultHtmlSymb)

//
    val value = defaultHtmlMirror()
    println(value)
//


    val result = Copier(atom, ("defaultHtml", "updated12345"))

    println(result.defaultHtml)
  }

  def updateAtom() = AuthAction {
    val testAtom = previewDataStore.getAtom(DynamoCompositeKey("Media", Some("8ba4c6c8-0815-45d9-9e87-0a6c20954094"))).fold(
      err => Logger.error(err.msg),
      atom => { //updateField(atom, "contentChangeDetails.lastModified.date", "12345")
        val newAtom = (atom :: AnyTrait).copyWith(("defaultHtml", "12345"))
        println(newAtom)
      }
    )
    Ok("yay!")
  }
}
