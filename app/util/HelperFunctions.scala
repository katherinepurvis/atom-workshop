package util

import com.gu.contentatom.thrift._
import models._
import io.circe.{DecodingFailure, ParsingFailure, parser}
import cats.syntax.either._
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import play.api.Logger
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.syntax._
import io.circe._
import io.circe.parser.decode
import io.circe.generic.auto._

object HelperFunctions {
  def getVersion(version: String): Version = version match {
    case "preview" => Preview
    case "live" => Live
  }

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

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

  def extractRequestBody(body: Option[String]): Either[AtomAPIError, String]= {
    Either.cond(body.isDefined, body.get, BodyRequiredForUpdateError)
  }

  def parseToAtomJson(atomJson: String): Either[AtomAPIError, Atom] = {
    Logger.info(s"Parsing atom json: $atomJson")
    val parsingResult = for {
      parsedAtom <- parser.parse(atomJson)
      decodedAtom <- parsedAtom.as[Atom]
    } yield decodedAtom
    parsingResult.fold(processException, a => Right(a))
  }

  def parseFromAtomToJson(atom: Atom): Json = {
    Logger.info(s"Parsing atom to json: $atom")
    atom.asJson
  }

  def parseValueToUpdateJson(atomJson: String): Either[AtomAPIError, String] = {
    Logger.info(s"Parsing value to update json: $atomJson")
    val parsingResult = for {
      parsedJson <- parser.parse(atomJson)
      value <- parsedJson.hcursor.downField("value").as[String]
    } yield value
    parsingResult.fold(processException, a => Right(a))
  }
}