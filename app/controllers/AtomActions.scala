package controllers

import cats.syntax.either._
import com.gu.contentatom.thrift.{Atom, EventType}
import db.AtomDataStores._
import db.AtomWorkshopDBAPI
import db.NotificationsDB
import models._
import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import services.AtomPublishers._
import util.AtomLogic._
import util.AtomUpdateOperations._
import io.circe._
import com.gu.fezziwig.CirceScroogeMacros._
import com.gu.pandomainauth.action.UserRequest

class AtomActions(
  val wsClient: WSClient, 
  val atomWorkshopDB: AtomWorkshopDBAPI, 
  val notificationsDB: NotificationsDB) extends Controller with PanDomainAuthActions {
    
  private def getCurrentDraftAtom(atomType: String, id: String): Either[AtomAPIError, Atom] = for {
    atomType <- validateAtomType(atomType)
    currentDraftAtom <- atomWorkshopDB.getAtom(previewDataStore, atomType, id)
  } yield currentDraftAtom

  private def publishUpdatedAtom(atom: Atom, req: UserRequest[_]): Either[AtomAPIError, Atom] = {
    atomWorkshopDB.publishAtom(publishedDataStore, req.user, updateTopLevelFields(atom, req.user, publish=true)).flatMap { updatedAtom =>
      val previewUpdateResult = atomWorkshopDB.updateAtom(previewDataStore, updatedAtom)
      val liveKinesisResult = sendKinesisEvent(updatedAtom, liveAtomPublisher, EventType.Update)
      val previewKinesisResult = sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)

      for {
        _ <- previewUpdateResult
        _ <- liveKinesisResult
        _ <- previewKinesisResult
      } yield updatedAtom
    }
  }
}
