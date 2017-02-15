package util

import com.gu.contentatom.thrift.{Atom, AtomType}
import io.circe.{DecodingFailure, ParsingFailure, parser}
import cats.syntax.either._
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import play.api.Logger
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.syntax._
import io.circe._
import io.circe.parser.decode
import io.circe.generic.auto._
import models._

object AtomLogic {
  def getVersion(version: String): Version = version match {
    case "preview" => Preview
    case "live" => Live
  }

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

  def checkAtomCanBeDeletedFromPreview(responseFromLiveDatastore:Either[AtomAPIError, Atom]): Either[AtomAPIError, String] =
    responseFromLiveDatastore.fold(_ => Right("Atom does not exist on live"), _ => Left(DeleteAtomFromPreviewError))

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

  def parseStringToAtom(atomString: String): Either[AtomAPIError, Atom] = {
    Logger.info(s"Parsing atom json: $atomString")
    val parsingResult = for {
      parsedAtom <- parser.parse(atomString)
      decodedAtom <- parsedAtom.as[Atom]
    } yield decodedAtom
    parsingResult.fold(processException, a => Right(a))
  }

  def parseJsonToAtom(atomJson: Json): Either[AtomAPIError, Atom] = {
    Logger.info(s"Parsing atom json: $atomJson")
    val parsingResult = for {
      decodedAtom <- atomJson.as[Atom]
    } yield decodedAtom
    parsingResult.fold(processException, a => Right(a))
  }

  def parseAtomToJson(atom: Atom): Json = {
    Logger.info(s"Parsing atom to json: $atom")
    atom.asJson
  }

  def parseBody(atomJson: String): Either[AtomAPIError, Json] = {
    Logger.info(s"Parsing body to json: $atomJson")
    val parsingResult = for {
      parsedJson <- parser.parse(atomJson)
    } yield parsedJson
    parsingResult.fold(processException, a => Right(a))
  }
}