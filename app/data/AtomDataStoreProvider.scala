package data

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.gu.atom.data.PreviewDynamoDataStore
import com.gu.contentatom.thrift.AtomData
import com.gu.contentatom.thrift.atom.media.MediaAtom
import com.gu.contentatom.thrift.AtomData.Media
import com.gu.contentatom.thrift.AtomDataAliases.MediaAlias

// dynamo formats
import com.gu.scanamo.scrooge.ScroogeDynamoFormat
import ScroogeDynamoFormat._
import com.gu.scanamo.DynamoFormat
import DynamoFormat._

// do not remove this import. it has magic powers
import cats.syntax.either._

class PreviewAtomDataStore(dynamo: AmazonDynamoDBClient, tableName: String) {
  val store = new PreviewDynamoDataStore[MediaAtom](dynamo, tableName) {
    override def fromAtomData: PartialFunction[AtomData, MediaAlias] = {case AtomData.Media(data) => data}
    override def toAtomData(data: MediaAtom): Media = AtomData.Media(data)
  }
}
