package db

import com.gu.contentatom.thrift.{Atom, AtomType}
import com.gu.atom.data.{DynamoCompositeKey, DynamoDataStore, DataStoreResult}
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.{DisplayType, ExplainerAtom}
import com.gu.contentatom.thrift.atom.media.MediaAtom
import play.api.Logger
import cats.syntax.either._
import models.{AtomAPIError, AtomWorkshopDynamoDatastoreError}
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe._
import io.circe.syntax._
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

  def getAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType, id: String) = {
    transformAtomLibResult(datastore.getAtom(AtomWorkshopDB.buildKey(atomType, id)))
  }

  def updateAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType, user: User, currentVersion: Atom, newAtom: Atom): Either[AtomAPIError, Unit]  = {
    val updatedAtom = currentVersion.copy(
      contentChangeDetails = buildContentChangeDetails(user, Some(currentVersion.contentChangeDetails), updateLastModified = true),
      defaultHtml = buildDefaultHtml(atomType, currentVersion.data, Some(currentVersion.defaultHtml)),
      data = newAtom.data
    )
    try {
      val result = datastore.updateAtom(updatedAtom)
      Logger.info(s"Successfully updated atom of type ${atomType.name} with id ${currentVersion.id}")
      Right(transformAtomLibResult(result))
    } catch {
      case e: Exception => processException(e)
    }

  }


}