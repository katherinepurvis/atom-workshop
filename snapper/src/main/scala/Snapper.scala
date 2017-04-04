package com.gu.atomworkshop.snapper

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.services.dynamodbv2._
import model._

object Snapper extends App {
r
  val dynamoTable = "atom-workshop-preview-DEV"
  val streamArn = "arn:aws:dynamodb:eu-west-1:743583969668:table/atom-workshop-preview-DEV/stream/2017-04-04T08:12:21.600"
  val authProvider = new ProfileCredentialsProvider("composer")
  val streamsClient = new AmazonDynamoDBStreamsClient(authProvider)
  val streamDetails = streamsClient.describeStream(
    new DescribeStreamRequest().withStreamArn(streamArn)
  )

 // val dbClient = {
  //   val client = new AmazonDynamoDBClient(authProvider)
  //   client.setEndpoint("https://dynamodb.eu-west-1.amazonaws.com")
  //   client
  // }
  
  // val tableDetails = dbClient.describeTable(dynamoTable)
 
//   val streamDetails =
//     streamsClient.describeStream(
//       new DescribeStreamRequest()
//         .withStreamArn(tableDetails.getTable().getLatestStreamArn())
//     )



//   val streamArn = t
//   val streamDetails = 
//   // println(streamArn)
//   // getShardIteratorRequest = new GetShardIteratorRequest()
//   //   .withStreamArn(streamArn)
//   //   .withShardId(shardId)
//     // .withShardIteratorType(ShardIteratorType.TRIM_HORIZON);

}
