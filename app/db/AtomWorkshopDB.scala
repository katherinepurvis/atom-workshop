package db

import com.gu.contentatom.thrift.{Atom, AtomType}
import com.gu.atom.data.{DataStoreResult, DynamoCompositeKey, DynamoDataStore}
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.ExplainerAtom
import com.gu.contentatom.thrift.atom.media.MediaAtom
import play.api.Logger
import cats.syntax.either._
import models.{AtomAPIError, AtomWorkshopDynamoDatastoreError, UnsupportedAtomTypeError}
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe._
import util.AtomElementBuilders._
import com.gu.pandomainauth.model.User
import util.HelperFunctions._

object AtomWorkshopDB {

  def buildKey(atomType: AtomType, id: String) = DynamoCompositeKey(atomType.name, Some(id))

  def transformAtomLibResult[T](result: DataStoreResult.DataStoreResult[T]): Either[AtomAPIError, T] = result match {
    case Left(e) => Left(AtomWorkshopDynamoDatastoreError(e.msg))
    case Right(r:T) => Right(r)
  }

  def createAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType, user: User) = {
    val defaultAtom = buildDefaultAtom(atomType, user)
    Logger.info(s"Attempting to create atom of type ${atomType.name} with id ${defaultAtom.id}")
    try {
      val r = datastore.createAtom(buildKey(atomType, defaultAtom.id), defaultAtom)
      Logger.info(s"Successfully created atom of type ${atomType.name} with id ${defaultAtom.id}")
      getAtom(datastore, atomType, defaultAtom.id)
    } catch {
      case e: Exception => processException(e)
    }
  }

  def getAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType, id: String): Either[AtomAPIError, Atom] = {
    transformAtomLibResult(datastore.getAtom(AtomWorkshopDB.buildKey(atomType, id)))
  }

  private def updateAtomInDatastore(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atom: Atom): Either[AtomAPIError, Unit] = {
    try {
      val result = datastore.updateAtom(atom)
      Logger.info(s"Successfully updated atom of type ${atom.atomType.name} with id ${atom.id}")
      Right(transformAtomLibResult(result))
    } catch {
      case e: Exception => processException(e)
    }
  }

  private def createAtomFromUpdatedAtom(atom: Atom, updatedAtom: Atom, user: User): Atom =
    atom.copy(
      contentChangeDetails = buildContentChangeDetails(user, Some(atom.contentChangeDetails), updateLastModified = true),
      defaultHtml = buildDefaultHtml(atom.atomType, updatedAtom.data, Some(atom.defaultHtml)),
      data = updatedAtom.data
    )

  def updateAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom],
                 atomType: AtomType,
                 user: User,
                 currentVersion: Atom,
                 newAtom: Atom): Either[AtomAPIError, Unit] = {

    val updatedAtom: Atom = createAtomFromUpdatedAtom(currentVersion, newAtom, user)
    updateAtomInDatastore(datastore, updatedAtom)
  }

  def updateAtomByPath(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom],
                       atomType: AtomType,
                       user: User,
                       currentJson: Json,
                       newJson: Json): Either[AtomAPIError, Unit]  = {

    val updatedAtomJson: Json = currentJson.deepMerge(newJson)

    val updatedAtom = for {
      atom <- parseStringToAtom(currentJson.toString)
      updAtom <- parseJsonToAtom(updatedAtomJson)
    } yield createAtomFromUpdatedAtom(atom, updAtom, user)

    updatedAtom.fold(err => Left(err), updateAtomInDatastore(datastore, _))
  }


}