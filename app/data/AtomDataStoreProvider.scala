package data

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.gu.atom.data.PreviewDynamoDataStore
import com.gu.contentatom.thrift.AtomData
import com.gu.contentatom.thrift.atom.media.MediaAtom
import com.gu.atom.data.AtomScroogeImplicits._

class PreviewAtomDataStore(dynamo: AmazonDynamoDBClient, tableName: String) extends PreviewDynamoDataStore[MediaAtom](dynamo, tableName) {
  override def fromAtomData = {case AtomData.Media(data) => data}
  override def toAtomData(data: MediaAtom) = AtomData.Media(data)
}