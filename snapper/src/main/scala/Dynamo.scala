package com.gu.atomworkshop.snapper

import scala.collection.JavaConversions._
import com.amazonaws.services.dynamodbv2._
import com.amazonaws.services.dynamodbv2.model._

class Dynamo(conf: Config) {
  type ShardIterator = String

  lazy val dbClient = AmazonDynamoDBClientBuilder.standard()
    .withCredentials(conf.authProvider)
    .withRegion(conf.region)
    .build()

  lazy val streamArn = {
    val tableData = dbClient.describeTable(conf.tableName)
    tableData.getTable().getLatestStreamArn()
  }

  lazy val streamsClient =
    AmazonDynamoDBStreamsClientBuilder.standard()
      .withCredentials(conf.authProvider)
      .withRegion(conf.region)
      .build()

  def getShards() = {
    val describeStreamsResult =
      streamsClient.describeStream(new DescribeStreamRequest()
        .withStreamArn(streamArn))

    describeStreamsResult.getStreamDescription().getShards().toList
  }

  def getStreamIterators(lastSeen: Option[String]): List[ShardIterator] = {
    val shards = getShards()
    shards map { shard =>
      getIterator(shard.getShardId, lastSeen)
    }
  }

  def getIterator(shardId: String, lastSeen: Option[String]) = {
    val getShardIteratorRequest = {
      val req = new GetShardIteratorRequest()
        .withStreamArn(streamArn)
        .withShardId(shardId)
      lastSeen match {
        case Some(id) =>
          req.withSequenceNumber(id)
            .withShardIteratorType(ShardIteratorType.AFTER_SEQUENCE_NUMBER)
        case None =>
          req.withShardIteratorType(ShardIteratorType.TRIM_HORIZON)
      }
    }
    streamsClient.getShardIterator(getShardIteratorRequest).getShardIterator
  }

  def getRecords(it: ShardIterator) =
    streamsClient.getRecords(
      new GetRecordsRequest().withShardIterator(it)
    ).getRecords().toList
}
