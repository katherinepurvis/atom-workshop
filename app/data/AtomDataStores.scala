package data

import com.gu.atom.data.{PublishedDynamoDataStore, PreviewDynamoDataStore}
import com.gu.contentatom.thrift._
import com.gu.contentatom.thrift.atom.media.MediaAtom
import com.gu.scanamo.scrooge.ScroogeDynamoFormat._
import com.gu.scanamo.DynamoFormat
import DynamoFormat._
import cats.syntax.either._
import config.Config

object AtomDataStores {
  val previewStore = new PreviewDynamoDataStore[MediaAtom](Config.dynamoDB, Config.previewDynamoTableName) {
    def fromAtomData: PartialFunction[AtomData, MediaAtom] = { case AtomData.Media(data) => data }
    def toAtomData(data: MediaAtom): AtomData = AtomData.Media(data)
  }
  val publishedStore = new PublishedDynamoDataStore[MediaAtom](Config.dynamoDB, Config.publishedDynamoTableName) {
    def fromAtomData: PartialFunction[AtomData, MediaAtom] = { case AtomData.Media(data) => data }
    def toAtomData(data: MediaAtom): AtomData = AtomData.Media(data)
  }
}
