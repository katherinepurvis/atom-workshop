package util

import com.gu.draftcontentatom.thrift.{Atom, AtomType}
import models._
import cats.syntax.either._
import com.gu.atom.data.DynamoCompositeKey
import io.circe.generic.auto._
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import io.circe.{DecodingFailure, ParsingFailure}
import play.api.Logger

object DraftLogic {

  def validateDraftType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

  def buildDraftKey(atomType: AtomType, id: String) = DynamoCompositeKey(atomType.name, Some(id))

  def createDraftFromJson(jsonString: Option[String]): Either[AtomAPIError, Atom] =
    jsonString.map(x =>
      for {
        json <- Parser.stringToJson(x)
        draft <- json.as[Atom].fold(processException, m => Right(m))
      } yield draft
    ).getOrElse(Left(AtomJsonParsingError("Draft Atom could not be created from the json.")))

  def processException(exception: Exception): Either[AtomAPIError, Nothing] = {
    val atomApiError = exception match {
      case e: ParsingFailure => AtomJsonParsingError(e.message)
      case e: DecodingFailure => AtomThriftDeserialisingError(e.message)
      case e: AmazonDynamoDBException => AmazonDynamoError(e.getMessage)
      case _ => UnexpectedExceptionError
    }
    Logger.error(atomApiError.msg, exception)
    Left(atomApiError)
  }
}
