package controllers

import com.gu.atom.data.PreviewDataStore
import config.Config
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc._
import cats.syntax.either._
import cats.instances.either._

class App(val wsClient: WSClient, implicit val previewDataStore: PreviewDataStore) extends Controller with PanDomainAuthActions {

  def index = AuthAction {
    Logger.info(s"I am the ${Config.appName}")

    println(previewDataStore.listAtoms)

    Ok(views.html.index())
  }
}
