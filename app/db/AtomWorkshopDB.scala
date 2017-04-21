package db

import cats.syntax.either._
import com.gu.atom.data._
import com.gu.contentatom.thrift.{Atom, AtomType}
import com.gu.pandomainauth.model.User
import models.{AtomAPIError, AtomWorkshopDynamoDatastoreError, Live}
import play.api.Logger
import util.AtomLogic._
import db.AtomDataStores._
import com.gu.draftcontentatom.thrift.{Atom => Draft}
import AtomWorkshopDbAPI._

class AtomWorkshopDraftDbAPI() {
  val datastore: DraftDynamoDataStore = draftDataStore

  def getDraft(atomType: AtomType, id: String): Either[AtomAPIError, Draft] =
    transformAtomLibResult(datastore.getAtom(buildKey(atomType, id)))
}

class AtomWorkshopPublishedDbAPI() {

  val datastore: PublishedDynamoDataStore = publishedDataStore

  def createAtom(atomType: AtomType, user: User, atom: Atom): Either[AtomAPIError, Atom] = {
    Logger.info(s"Attempting to create atom of type ${atomType.name} with id ${atom.id}")
    try {
      val result = datastore.createAtom(buildKey(atomType, atom.id), atom)
      Logger.info(s"Successfully created atom of type ${atomType.name} with id ${atom.id}")
      transformAtomLibResult(result)
    } catch {
      case e: Exception => processException(e)
    }
  }

  def getAtom(atomType: AtomType, id: String): Either[AtomAPIError, Atom] =
    transformAtomLibResult(datastore.getAtom(buildKey(atomType, id)))

  def updateAtom(atom: Atom): Either[AtomAPIError, Atom] = {
    try {
      val result = datastore.updateAtom(atom)
      Logger.info(s"Successfully updated atom of type ${atom.atomType.name} with id ${atom.id}")
      transformAtomLibResult(result)
    } catch {
      case e: Exception => processException(e)
    }
  }

  def publishAtom(user: User, newAtom: Atom): Either[AtomAPIError, Atom] = {

    def checkAtomExistsInDatastore(atomType: AtomType, id: String): Either[AtomAPIError, Boolean] =
      datastore.getAtom(buildKey(atomType, id)).fold({
        case IDNotFound => Right(false)
        case e => Left(AtomWorkshopDynamoDatastoreError(e.msg))
      }, _ => Right(true))

    checkAtomExistsInDatastore(newAtom.atomType, newAtom.id).fold(err => Left(err), result => {
      if (result) updateAtom(newAtom)
      else createAtom(newAtom.atomType, user, newAtom)
    })
  }

  def deleteAtom(atomType: AtomType, id: String) =
    transformAtomLibResult(datastore.deleteAtom(buildKey(atomType, id)))
}

class AtomWorkshopPreviewDbAPI() {

  val datastore: PreviewDynamoDataStore = previewDataStore

  def createAtom(atomType: AtomType, user: User, atom: Atom): Either[AtomAPIError, Atom] = {
    Logger.info(s"Attempting to create atom of type ${atomType.name} with id ${atom.id}")
    try {
      val result = datastore.createAtom(buildKey(atomType, atom.id), atom)
      Logger.info(s"Successfully created atom of type ${atomType.name} with id ${atom.id}")
      transformAtomLibResult(result)
    } catch {
      case e: Exception => processException(e)
    }
  }

  def getAtom(atomType: AtomType, id: String): Either[AtomAPIError, Atom] =
    transformAtomLibResult(datastore.getAtom(buildKey(atomType, id)))

  def updateAtom(atom: Atom): Either[AtomAPIError, Atom] = {
    try {
      val result = datastore.updateAtom(atom)
      Logger.info(s"Successfully updated atom of type ${atom.atomType.name} with id ${atom.id}")
      transformAtomLibResult(result)
    } catch {
      case e: Exception => processException(e)
    }
  }

  def publishAtom(user: User, newAtom: Atom): Either[AtomAPIError, Atom] = {

    def checkAtomExistsInDatastore(atomType: AtomType, id: String): Either[AtomAPIError, Boolean] =
      datastore.getAtom(buildKey(atomType, id)).fold({
        case IDNotFound => Right(false)
        case e => Left(AtomWorkshopDynamoDatastoreError(e.msg))
      }, _ => Right(true))

    checkAtomExistsInDatastore(newAtom.atomType, newAtom.id).fold(err => Left(err), result => {
      if (result) updateAtom(newAtom)
      else createAtom(newAtom.atomType, user, newAtom)
    })
  }

  def deleteAtom(atomType: AtomType, id: String) =
    transformAtomLibResult(datastore.deleteAtom(buildKey(atomType, id)))
}

object AtomWorkshopDbAPI {
  def transformAtomLibResult[T](result: DataStoreResult.DataStoreResult[T]): Either[AtomAPIError, T] = result match {
    case Left(e) => Left(AtomWorkshopDynamoDatastoreError(e.msg))
    case Right(r) => Right(r)
  }
}