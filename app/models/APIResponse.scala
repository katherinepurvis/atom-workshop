package models

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
    val res = result.fold(exceptionToResult(_), r => Ok(r.asJson.noSpaces))
    res.as("text/json")
  }
}