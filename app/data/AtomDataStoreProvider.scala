package data

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.gu.atom.data.PreviewDynamoDataStore
import com.gu.contentatom.thrift.AtomData
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.scanamo.scrooge.ScroogeDynamoFormat._
import cats.syntax.either._

class PreviewAtomDataStore(dynamo: AmazonDynamoDBClient, tableName: String) extends PreviewDynamoDataStore[CTAAtom](dynamo, tableName) {
  override def fromAtomData = {case AtomData.Cta(data) => data}
  override def toAtomData(data: CTAAtom) = AtomData.Cta(data)
}