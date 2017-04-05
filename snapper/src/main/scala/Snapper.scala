package com.gu.atomworkshop.snapper

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

object Snapper extends App {
  /* these are the configuration settings that are just being
   * hard-coded here because I don't want to include a proper
   * configuration tool right now. */
  val dynamoTable = "atom-workshop-preview-DEV"
  // this comes from the AWS console, after creating the stream for a given dynamo table.
  val streamArn = "arn:aws:dynamodb:eu-west-1:743583969668:table/atom-workshop-preview-DEV/stream/2017-04-04T08:12:21.600"
  val authProvider = new ProfileCredentialsProvider("composer")

  val streamsClient = {
    val cl = new AmazonDynamoDBStreamsClient(authProvider)
    cl.setEndpoint("https://streams.dynamodb.eu-west-1.amazonaws.com")
    cl
  }
  val streamDetails = streamsClient.describeStream(
    new DescribeStreamRequest().withStreamArn(streamArn)
  )
  println(streamDetails)
}
