package models

import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import com.gu.atom.data.DataStoreError
import play.api.Logger
import io.circe._
import io.circe.syntax._
import play.api.mvc._
import io.circe.generic.semiauto._

case class AtomWorkshopAPIResponse(message: String)
object AtomWorkshopAPIResponse{
  implicit val atomWorkshopApiResponseEncoder: Encoder[AtomWorkshopAPIResponse] = deriveEncoder[AtomWorkshopAPIResponse]
}


object APIResponse extends Results {
  def exceptionToResult(e: Exception) = {
    Logger.error(e.getMessage, e)
    InternalServerError(AtomWorkshopAPIResponse(e.getMessage).asJson.noSpaces)
  }

  def apply[T](result: Either[Exception, T])(implicit encoder: Encoder[T]): Result = {
    val res = result.fold({
      case e: DataStoreError => exceptionToResult(e)
      case e: AmazonDynamoDBException => exceptionToResult(e)
      case e: AtomAPIError => exceptionToResult(e)
    }, r => Ok(r.asJson.noSpaces))
    res.as("text/json")
  }
}