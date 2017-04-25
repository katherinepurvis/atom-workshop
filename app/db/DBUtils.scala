package db

import com.gu.atom.data.DataStoreResult
import models.{AtomAPIError, AtomWorkshopDynamoDatastoreError}

object DBUtils {
  def transformAtomLibResult[T](result: DataStoreResult.DataStoreResult[T]): Either[AtomAPIError, T] = result match {
    case Left(e) => Left(AtomWorkshopDynamoDatastoreError(e.msg))
    case Right(r) => Right(r)
  }
}
