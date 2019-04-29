package db

import com.gu.atom.data.DynamoDataStore
import com.gu.contentatom.thrift.Atom
import models.{AtomAPIError, ExplainerDynamoDatastoreError}
import play.api.Logger
import util.AtomLogic._

trait ExplainerDBAPI {
  def listAtoms(datastore: DynamoDataStore): Either[AtomAPIError, List[Atom]]
}

class ExplainerDB() extends ExplainerDBAPI {

  def listAtoms(datastore: DynamoDataStore): Either[AtomAPIError, List[Atom]] = {
    Logger.info(s"Attempting to read all explainers from ${datastore.getClass.getName}")
    try {
      val result = datastore.listAtoms
      Logger.info(s"Successfully read alls explainers from ${datastore.getClass.getName}")
      result.fold({
        case x: Throwable => Left(ExplainerDynamoDatastoreError(x.getMessage))
      }, Right(_))
    } catch {
      case e: Exception => processException(e)
    }
  }
}
