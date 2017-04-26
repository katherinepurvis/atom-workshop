package util

import SharedAtomDraftLogic._
import com.gu.draftcontentatom.thrift.{Atom, AtomType}
import models._
import cats.syntax.either._
import com.gu.atom.data.DynamoCompositeKey
import io.circe.generic.auto._

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
        draft <- json.as[Atom].fold(processException _, m => Right(m))
      } yield draft
    ).getOrElse(Left(AtomJsonParsingError("Draft Atom could not be created from the json.")))

}
