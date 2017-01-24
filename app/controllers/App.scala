package controllers

import com.gu.atom.data.{DynamoCompositeKey, PreviewDataStore}
import com.gu.contentatom.thrift.AtomData
import com.gu.contentatom.thrift.AtomData.Media
import config.Config
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import com.gu.contentatom.thrift.atom.media._
import cats.syntax.either._

class App(val wsClient: WSClient, previewDataStore: PreviewDataStore) extends Controller with PanDomainAuthActions {

  def index = AuthAction {
    Logger.info(s"I am the ${Config.appName}")

    val someAtom = previewDataStore.getAtom(DynamoCompositeKey("Media", Some("8ba4c6c8-0815-45d9-9e87-0a6c20954094"))).fold(
      err => err.msg,
      atom => atom.data.asInstanceOf[AtomData.Media].media.title
    )

    Ok(views.html.index(someAtom))
  }
}
