package db

import com.gu.contentatom.thrift.{Atom, AtomType}
import com.gu.atom.data.{DataStoreResult, DynamoCompositeKey, DynamoDataStore}
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.ExplainerAtom
import com.gu.contentatom.thrift.atom.media.MediaAtom
import com.gu.contentatom.thrift.atom.recipe.RecipeAtom
import play.api.Logger
import cats.syntax.either._
import models.{AtomAPIError, AtomWorkshopDynamoDatastoreError}
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe._
import util.AtomElementBuilders._
import com.gu.pandomainauth.model.User
import util.AtomLogic._

trait AtomWorkshopDBAPI {

  type DynamoDBDataStore = DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom with RecipeAtom]

  def buildKey(atomType: AtomType, id: String) = DynamoCompositeKey(atomType.name, Some(id))

  def transformAtomLibResult[T](result: DataStoreResult.DataStoreResult[T]): Either[AtomAPIError, T] = result match {
    case Left(e) => Left(AtomWorkshopDynamoDatastoreError(e.msg))
    case Right(r) => Right(r)
  }

  def createAtom(datastore: DynamoDBDataStore, atomType: AtomType, user: User): Either[AtomAPIError, Atom]

  def getAtom(datastore: DynamoDBDataStore, atomType: AtomType, id: String): Either[AtomAPIError, Atom]

  def deleteAtom(datastore: DynamoDBDataStore, atomType: AtomType, id: String): Either[AtomAPIError, Atom]

  def updateAtom(datastore: DynamoDBDataStore,
                 atomType: AtomType,
                 user: User,
                 currentVersion: Atom,
                 newAtom: Atom): Either[AtomAPIError, Atom]

  def updateAtomByPath(datastore: DynamoDBDataStore,
                       atomType: AtomType,
                       user: User,
                       currentJson: Json,
                       newJson: Json): Either[AtomAPIError, Atom]
}

class AtomWorkshopDB() extends AtomWorkshopDBAPI {

  def createAtom(datastore: DynamoDBDataStore, atomType: AtomType, user: User) = {
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

  def getAtom(datastore: DynamoDBDataStore, atomType: AtomType, id: String) =
    transformAtomLibResult(datastore.getAtom(buildKey(atomType, id)))


  def deleteAtom(datastore: DynamoDBDataStore, atomType: AtomType, id: String) =
    transformAtomLibResult(datastore.deleteAtom(buildKey(atomType, id)))

  private def updateAtomInDatastore(datastore: DynamoDBDataStore, atom: Atom): Either[AtomAPIError, Atom] = {
    try {
      val result = datastore.updateAtom(atom)
      Logger.info(s"Successfully updated atom of type ${atom.atomType.name} with id ${atom.id}")
      transformAtomLibResult(result)
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

  def updateAtom(datastore: DynamoDBDataStore,
                 atomType: AtomType,
                 user: User,
                 currentVersion: Atom,
                 newAtom: Atom): Either[AtomAPIError, Atom] = {

    val updatedAtom: Atom = createAtomFromUpdatedAtom(currentVersion, newAtom, user)
    updateAtomInDatastore(datastore, updatedAtom)
  }

  def updateAtomByPath(datastore: DynamoDBDataStore,
                       atomType: AtomType,
                       user: User,
                       currentJson: Json,
                       newJson: Json): Either[AtomAPIError, Atom]  = {

    val updatedAtomJson: Json = currentJson.deepMerge(newJson)

    val updatedAtom = for {
      atom <- parseStringToAtom(currentJson.toString)
      updAtom <- parseJsonToAtom(updatedAtomJson)
    } yield createAtomFromUpdatedAtom(atom, updAtom, user)

    updatedAtom.fold(err => Left(err), updateAtomInDatastore(datastore, _))
  }
}