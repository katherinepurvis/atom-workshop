package db

import com.gu.atom.data.DraftDynamoDataStore
import com.gu.draftcontentatom.thrift.{Atom, AtomType}
import models.AtomAPIError
import util.DraftLogic._
import db.AtomDataStores._
import DBUtils._

class AtomWorkshopDraftDbAPI() {
  val datastore: DraftDynamoDataStore = draftDataStore

  def getDraft(atomType: AtomType, id: String): Either[AtomAPIError, Atom] =
    transformAtomLibResult(datastore.getAtom(buildDraftKey(atomType, id)))

  def createDraft(atomType: AtomType, draft: Atom): Either[AtomAPIError, Atom] = {
    try {
      val result = datastore.createAtom(buildDraftKey(atomType, draft.id.get), draft)
      transformAtomLibResult(result)
    } catch {
      case e: Exception => processException(e)
    }
  }
}
