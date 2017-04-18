package com.gu.atomworkshop.snapper

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.services.dynamodbv2._

//class Snapper(streamArn: String) {
//   val authProvider = new ProfileCredentialsProvider("composer")
//   val streamsClient = {
//     val cl = new AmazonDynamoDBStreamsClient(authProvider)
//     cl.setEndpoint("https://streams.dynamodb.eu-west-1.amazonaws.com")
//     cl
//   }

//   def getShards = {
//     val streamDetailsResult = streamsClient.describeStream(
//       new DescribeStreamRequest().withStreamArn(streamArn)
//     )
//     streamDetailsResult.getStreamDescription.getShards
//   }

//   def newShardIterator(shardId: String, lastSeen: Option[String]) = {
//     val baseReq = new GetShardIteratorRequest()
//       .withStreamArn(streamArn)
//       .withShardId(shardId)

//     val req = lastSeen match {
//       case Some(id) =>
//         baseReq
//           .withShardIteratorType("AFTER_SEQUENCE_NUMBER")
//           .withSequenceNumber(id)
//       case None =>
//         baseReq
//           .withShardIteratorType("TRIM_HORIZON")
//     }
//     streamsClient.getShardIterator(req).getShardIterator
//   }

//   def process() =
//     for(shard <- getShards) {
//       val shardId = shard.getShardId
//       val it = newShardIterator(shardId, None)
//       processIterator(it)
//     }

//   def processIterator(it: String) = {
//     val recordsResult = streamsClient.getRecords(
//       new GetRecordsRequest().withShardIterator(it)
//     )
//     val records = recordsResult.getRecords
//     records foreach { record =>
//       println(record)
//     }
//   }
// }

object SnapperTest {
  val conf = Config(
    tableName   = "atom-workshop-preview-DEV",
    authProfile = "composer",
    regionName  = "eu-west-1"
  )
  val dynamo = new Dynamo(conf)

  def main(args: Array[String]): Unit = {
    val fetcher = new EventFetcher(dynamo)
    println(fetcher.fetchEvents(None))
  }
}
