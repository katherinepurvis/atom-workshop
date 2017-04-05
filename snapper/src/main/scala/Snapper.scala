package com.gu.atomworkshop.snapper

import scala.collection.JavaConversions._
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.services.dynamodbv2._
import model._

/*
 * what am I trying to do here? I want to write a test program that
 * will load up and check the dynamodb stream for the atom workshop
 * database. If there have been any DB changes since the last time it
 * was run, it will snapshot those database entries (presumably in
 * it's own db). This test PoC app will probably just log those
 * changes.
 */

class Snapper(streamArn: String) {
  val authProvider = new ProfileCredentialsProvider("composer")
  val streamsClient = {
    val cl = new AmazonDynamoDBStreamsClient(authProvider)
    cl.setEndpoint("https://streams.dynamodb.eu-west-1.amazonaws.com")
    cl
  }

  def getShards = {
    val streamDetailsResult = streamsClient.describeStream(
      new DescribeStreamRequest().withStreamArn(streamArn)
    )
    streamDetailsResult.getStreamDescription.getShards
  }

  def newShardIterator(shardId: String) = {
    streamsClient.getShardIterator(
      new GetShardIteratorRequest()
        .withStreamArn(streamArn)
        .withShardId(shardId)
        .withShardIteratorType(ShardIteratorType.TRIM_HORIZON)
    ).getShardIterator
  }

  def process(iterators: Map[String, String]): Map[String, String] = {
    (for(shard <- getShards) yield {
      val shardId = shard.getShardId
      println(s"Processing shard: $shardId")
      val it = iterators.get(shardId) match {
        case Some(it) =>
          println(s"\tfound iterator: $it")
          it
        case None =>
          val it = newShardIterator(shardId)
          println(s"\trequested new iterator: $it")
          it
      }
      processIterator(it) match {
        case null => None
        case nextIt => Some(shardId -> nextIt)
      }
    }).flatten.toMap
  }

  def processIterator(it: String): String = {
  val recordsResult = streamsClient.getRecords(
      new GetRecordsRequest().withShardIterator(it)
    )
    val records = recordsResult.getRecords
    println(s"\tRecords: ${records.length}")
    recordsResult.getNextShardIterator()
  }

}

object SnapperTest {
  val snapper = new Snapper("arn:aws:dynamodb:eu-west-1:743583969668:table/atom-workshop-preview-DEV/stream/2017-04-04T08:12:21.600")

  @annotation.tailrec
  def run(delay: Long = 5000, iterators: Map[String, String] = Map.empty): Unit = {
    println(s"Sleeping for ${delay}ms")
    Thread.sleep(delay)
    val nextIterators = snapper.process(iterators)
    run(delay, nextIterators)
  }

  def main(args: Array[String]): Unit = {

    run()
  }
}
