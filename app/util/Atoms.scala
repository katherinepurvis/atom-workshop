package util

import com.gu.contentatom.thrift.{Atom, AtomType}
import com.gu.pandomainauth.model.{User => PandaUser}
import models._
import org.joda.time.DateTime
import io.circe.{DecodingFailure, ParsingFailure}
import cats.syntax.either._
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import play.api.Logger
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.syntax._
import io.circe._
import io.circe.parser.decode

object Atoms {
  def getVersion(version: String): Version = version match {
    case "preview" => Preview
    case "live" => Live
  }

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

  def checkAtomCanBeDeletedFromPreview(responseFromLiveDatastore:Either[AtomAPIError, Atom]): Either[AtomAPIError, Unit] =
    responseFromLiveDatastore.fold(_ => Right(), _ => Left(DeleteAtomFromPreviewError))

  def processException(exception: Exception) = {
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

  def parseAtomJson(atomJson: String): Either[AtomAPIError, Atom] = {
    Logger.info(s"Parsing atom json: ${atomJson}")
    val parsingResult = for {
      parsedAtom <- parser.parse(atomJson)
      decodedAtom <- parsedAtom.as[Atom]
    } yield {
      decodedAtom
    }
    parsingResult.fold(processException, a => Right(a))
  }
}