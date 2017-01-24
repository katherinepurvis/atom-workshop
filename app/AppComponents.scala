import config.{Config, LogConfig}
import data.PreviewAtomDataStore
import play.api.ApplicationLoader.Context
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents {

  val logger = new LogConfig

  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets)
  lazy val assets = new controllers.Assets(httpErrorHandler)
  lazy val appController = new controllers.App(wsClient, atomDataStore)
  lazy val loginController = new controllers.Login(wsClient)
  lazy val healthcheckController = new controllers.Healthcheck()

  lazy val atomDataStore = new PreviewAtomDataStore(Config.dynamoDB, Config.previewDynamoTableName).store
}


