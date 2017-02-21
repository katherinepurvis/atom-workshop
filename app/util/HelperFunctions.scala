package util

import cats.data.{NonEmptyList, Validated}
import com.gu.contentatom.thrift._
import com.gu.pandomainauth.model.{User => PandaUser}
import models._
import org.joda.time.DateTime
import io.circe.{DecodingFailure, ParsingFailure, parser}
import cats.syntax.either._
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import play.api.Logger
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.syntax._
import io.circe._
import io.circe.parser.decode

object HelperFunctions {
  def getVersion(version: String): Version = version match {
    case "preview" => Preview
    case "live" => Live
  }

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

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

  def processExceptionList(errorList:NonEmptyList[DecodingFailure]) = {
    AtomThriftDeserialisingError(errorList.foldLeft("Unable to deserialise payload: ")((acc, error)=>{
      acc + s"\n\t${error.toString}"
    }))
  }

  def extractRequestBody(body: Option[String]): Either[AtomAPIError, String]= {
    Either.cond(body.isDefined, body.get, BodyRequiredForUpdateError)
  }

  def parseAtomJson(atomJson: String): Either[AtomAPIError, Atom] = {
    println(atomJson)

    parser.parse(atomJson) match {
      case Right(atomJsonContent)=>
        val decoder = AccumulatingDecoder[Atom]
        decoder.apply(atomJsonContent.hcursor) match {
          case Validated.Valid(atom)=>Right(atom)
          case Validated.Invalid(errorList)=>Left(processExceptionList(errorList))
        }
      case Left(parserError)=>
        processException(parserError)
    }

  }

}