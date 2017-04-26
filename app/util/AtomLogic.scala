package util

import cats.syntax.either._
import com.gu.atom.data.DynamoCompositeKey
import com.gu.contentatom.thrift.{Atom, AtomType}
import com.gu.fezziwig.CirceScroogeMacros._
import com.gu.pandomainauth.model.User
import io.circe.{parser, _}
import models._
import play.api.Logger
import util.atomBuilders.AtomElementBuilder._
import SharedAtomDraftLogic._

object AtomLogic {

  def buildKey(atomType: AtomType, id: String) = DynamoCompositeKey(atomType.name, Some(id))

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

  def checkAtomCanBeDeletedFromPreview(responseFromLiveDatastore:Either[AtomAPIError, Atom]): Either[AtomAPIError, String] =
    responseFromLiveDatastore.fold(_ => Right("Atom does not exist on live"), _ => Left(DeleteAtomFromPreviewError))

  def updateTakenDownChangeRecord(atom: Atom, user: User): Atom =
    atom.copy(contentChangeDetails = buildContentChangeDetails(user, Some(atom.contentChangeDetails), updateTakenDown = true))
}

object Parser {

  def stringToAtom(atomString: String): Either[AtomAPIError, Atom] = {
    Logger.info(s"Parsing atom json: $atomString")
    for {
      json <- stringToJson(atomString)
      atom <- jsonToAtom(json)
    } yield atom
  }

  def jsonToAtom(json: Json): Either[AtomAPIError, Atom] = {
    Logger.info(s"Parsing json: $json")
    json.as[Atom].fold(processException, m => Right(m))
  }

  def stringToJson(atomJson: String): Either[AtomAPIError, Json] = {
    Logger.info(s"Parsing body to json: $atomJson")
    val parsingResult = for {
      parsedJson <- parser.parse(atomJson)
    } yield parsedJson
    parsingResult.fold(processException, a => Right(a))
  }
}