package data

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.gu.atom.data.PreviewDynamoDataStore
import com.gu.contentatom.thrift._
import com.gu.contentatom.thrift.atom.media.MediaAtom
import com.gu.scanamo.scrooge.ScroogeDynamoFormat._
import com.gu.scanamo.DynamoFormat
import DynamoFormat._
import cats.syntax.either._

class PreviewAtomDataStore(dynamo: AmazonDynamoDBClient, tableName: String) {
  val store = new PreviewDynamoDataStore[MediaAtom](dynamo, tableName) {
    def fromAtomData: PartialFunction[AtomData, MediaAtom] = { case AtomData.Media(data) => data }
    def toAtomData(data: MediaAtom): AtomData = AtomData.Media(data)
  }
}
