package db

import com.gu.contentatom.thrift.{Atom, AtomType}
import com.gu.atom.data.{DataStoreResult}
import play.api.Logger
import cats.syntax.either._
import models.{AtomAPIError, AtomWorkshopDynamoDatastoreError}
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe._
import util.AtomElementBuilders._
import com.gu.pandomainauth.model.User
import util.AtomLogic._
import util.Parser._
import AtomDataStores._

trait AtomWorkshopDBAPI {

  def transformAtomLibResult[T](result: DataStoreResult.DataStoreResult[T]): Either[AtomAPIError, T] = result match {
    case Left(e) => Left(AtomWorkshopDynamoDatastoreError(e.msg))
    case Right(r) => Right(r)
  }

  def createAtom(datastore: AtomWorkshopDataStore, atomType: AtomType, user: User, atom: Option[Atom] = None): Either[AtomAPIError, Atom]

  def getAtom(datastore: AtomWorkshopDataStore, atomType: AtomType, id: String): Either[AtomAPIError, Atom]

  def deleteAtom(datastore: AtomWorkshopDataStore, atomType: AtomType, id: String): Either[AtomAPIError, Atom]

  def updateAtom(datastore: AtomWorkshopDataStore, atomType: AtomType, user: User, currentVersion: Atom,
    newAtom: Option[Atom] = None): Either[AtomAPIError, Atom]

  def updateAtomByPath(datastore: AtomWorkshopDataStore, atomType: AtomType, user: User, currentJson: Json,
    newJson: Json): Either[AtomAPIError, Atom]

  def createOrUpdateAtom(datastore: AtomWorkshopDataStore, atomType: AtomType, user: User, newVersion: Atom): Either[AtomAPIError, Atom]
}

class AtomWorkshopDB() extends AtomWorkshopDBAPI {

  def createAtom(datastore: AtomWorkshopDataStore, atomType: AtomType, user: User, atom: Option[Atom] = None) = {
    val defaultAtom = atom.getOrElse(buildDefaultAtom(atomType, user))
    Logger.info(s"Attempting to create atom of type ${atomType.name} with id ${defaultAtom.id}")
    try {
      val r = datastore.createAtom(buildKey(atomType, defaultAtom.id), defaultAtom)
      Logger.info(s"Successfully created atom of type ${atomType.name} with id ${defaultAtom.id}")
      getAtom(datastore, atomType, defaultAtom.id)
    } catch {
      case e: Exception => processException(e)
    }
  }

  def getAtom(datastore: AtomWorkshopDataStore, atomType: AtomType, id: String) =
    transformAtomLibResult(datastore.getAtom(buildKey(atomType, id)))


  def deleteAtom(datastore: AtomWorkshopDataStore, atomType: AtomType, id: String) =
    transformAtomLibResult(datastore.deleteAtom(buildKey(atomType, id)))

  private def updateAtomInDatastore(datastore: AtomWorkshopDataStore, atom: Atom): Either[AtomAPIError, Atom] = {
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

  def updateAtom(datastore: AtomWorkshopDataStore,
                 atomType: AtomType,
                 user: User,
                 currentVersion: Atom,
                 newAtom: Option[Atom] = None): Either[AtomAPIError, Atom] = {

    val updatedAtom: Atom = createAtomFromUpdatedAtom(currentVersion, newAtom.getOrElse(currentVersion), user)
    updateAtomInDatastore(datastore, updatedAtom)
  }

  def updateAtomByPath(datastore: AtomWorkshopDataStore,
                       atomType: AtomType,
                       user: User,
                       currentJson: Json,
                       newJson: Json): Either[AtomAPIError, Atom]  = {

    val updatedAtomJson: Json = currentJson.deepMerge(newJson)

    val updatedAtom = for {
      atom <- jsonToAtom(currentJson)
      updAtom <- jsonToAtom(updatedAtomJson)
    } yield createAtomFromUpdatedAtom(atom, updAtom, user)

    updatedAtom.fold(err => Left(err), updateAtomInDatastore(datastore, _))
  }

  def createOrUpdateAtom(datastore: AtomWorkshopDataStore,
                         atomType: AtomType,
                         user: User,
                         newVersion: Atom): Either[AtomAPIError, Atom] = {

    checkAtomExistsInDatastore(datastore, atomType, newVersion.id).fold(err => Left(err), result => {
      if (result) updateAtom(datastore, atomType, user, newVersion)
      else createAtom(datastore, atomType, user, Some(newVersion))
    })
  }
}