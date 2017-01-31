package db

import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import com.gu.atom.data.{DynamoCompositeKey, DynamoDataStore}
import com.gu.contentatom.thrift.{Atom, AtomData, AtomType, ContentChangeDetails}
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.{DisplayType, ExplainerAtom}
import com.gu.contentatom.thrift.atom.media.MediaAtom
import play.api.Logger
import cats.syntax.either._

object AtomWorkshopDB {

  def buildKey(atomType: AtomType, id: String) = DynamoCompositeKey(atomType.name, Some(id))

  def buildDefaultAtom(atomType: AtomType) = {
    val defaultAtoms: Map[AtomType, AtomData] = Map(
      AtomType.Explainer -> AtomData.Explainer(ExplainerAtom("-", "-", DisplayType.Flat)),
      AtomType.Cta -> AtomData.Cta(CTAAtom(""))
    )

    Atom(id = java.util.UUID.randomUUID.toString,
      atomType = atomType,
      defaultHtml = s"""<div class="atom-${atomType.name}"></div>""",
      data = defaultAtoms(atomType),
      contentChangeDetails = ContentChangeDetails(revision = 0L))
  }

  def createAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType) = {
    val defaultAtom = buildDefaultAtom(atomType)
    Logger.info(s"Attempting to create atom of type ${atomType.name} with id ${defaultAtom.id}")
    try {
      val r = Right(datastore.createAtom(buildKey(atomType, defaultAtom.id), defaultAtom))
      Logger.info(s"Successfully created atom of type ${atomType.name} with id ${defaultAtom.id}")
      r
    } catch {
      case e: AmazonDynamoDBException =>
        Logger.error("Atom creation failed: ", e)
        Left(e)
    }
  }

  def getAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType, id: String) = {

  }


}