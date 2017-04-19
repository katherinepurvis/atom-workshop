package db

import com.gu.atom.data._
import com.gu.atom.publish.{PreviewKinesisAtomReindexer, PublishedKinesisAtomReindexer}
import config.Config._
import models._

//Imports required to use implicits
import com.gu.scanamo.scrooge.ScroogeDynamoFormat._
import com.gu.atom.data.AtomDynamoFormats._
import cats.syntax.either._

object AtomDataStores {
  def getDataStore(version: Version): DynamoDataStore = version match {
    case Live => publishedDataStore
    case Preview => previewDataStore
    case Draft => draftDataStore
  }

  val draftDataStore = new DraftDynamoDataStore(dynamoDB, draftDynamoDataStore)
  val previewDataStore = new PreviewDynamoDataStore(dynamoDB, previewDynamoTableName)
  val publishedDataStore = new PublishedDynamoDataStore(dynamoDB, publishedDynamoTableName)
}

object ReindexDataStores {
  val reindexPreview: PreviewKinesisAtomReindexer =
    new PreviewKinesisAtomReindexer(previewReindexKinesisStreamName, kinesisClient)

  val reindexPublished: PublishedKinesisAtomReindexer =
    new PublishedKinesisAtomReindexer(liveReindexKinesisStreamName, kinesisClient)
}