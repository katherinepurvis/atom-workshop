package controllers

import com.gu.atom.data.DynamoDataStore
import com.gu.atom.publish.{AtomReindexer, PreviewAtomReindexer, PublishedAtomReindexer}
import db.ExplainerDBAPI
import play.api.Configuration
import play.api.libs.ws.WSClient
import play.api.mvc.{ Action, AnyContent, Controller, Result }
import com.gu.contentatom.thrift.{ContentAtomEvent, EventType}
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

class ExplainerReindexController(
  val wsClient: WSClient,
  explainerDB: ExplainerDBAPI,
  previewDataStore: DynamoDataStore,
  publishedDataStore: DynamoDataStore,
  previewReindexer: PreviewAtomReindexer,
  publishedReindexer: PublishedAtomReindexer,
  config: Configuration
)(implicit ec: ExecutionContext) extends Controller with PanDomainAuthActions {

  def reindex(stack: String): Action[AnyContent] = AuthAction.async { req => 
    stack match {
      case "preview" => run(previewDataStore, previewReindexer) map displayResult recover displayError
      case "published" => run(publishedDataStore, publishedReindexer) map displayResult recover displayError
      case x => Future.successful(BadRequest(s"$x is not a valid stack identifier"))
    }
  }

  private def run(datastore: DynamoDataStore, reindexer: AtomReindexer): Future[Int] = {
    explainerDB.listAtoms(datastore).fold(
      apiError => Future.failed(new RuntimeException(apiError.msg)),
      { atoms =>
        val timestamp = System.nanoTime
        val events = atoms.map(ContentAtomEvent(_, EventType.Update, timestamp))
        reindexer.startReindexJob(events.iterator, events.size).execute
      }
    )
  }

  private def displayResult(result: Int): Result = Ok(s"Successfully reindexed $result explainers")

  private val displayError: PartialFunction[Throwable, Result] = {
    case x: Throwable => InternalServerError(s"Something went wrong: ${x.getMessage()}")
  }
}
