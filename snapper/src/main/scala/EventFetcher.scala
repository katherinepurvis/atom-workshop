package com.gu.atomworkshop.snapper

import scala.collection.JavaConversions._
import com.amazonaws.services.dynamodbv2.model._
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBStreamsClientBuilder
/**
  * Here we will connect to the DynamoDB's event stream and get a list
  * of events which have occured since we last checked. We are only
  * interested in the Set of IDs that have changed since the last
  * update, i.e. we don't need to snapshot each intervening version,
  * just the current version.
  *
  * We will need to know the last sequence number that we saw from the
  * event stream, we will ask the stream to send us any events that
  * happened after this.
  */

class EventFetcher(dynamo: Dynamo) {

  /* `lastSeen` will be None if we haven't actually run before, in which
   * case we will use TRIM_HORIZON to request everything that the
   * stream has. */
  def fetchEvents(lastSeen: Option[String]): List[String] = {
    /* get the iterators from the stream, which will represent the
     * available events. This may be consist of multiple shards, each
     * with thier own iterator, and which we can process in parallel
     * if we want to. */
    val its = dynamo.getStreamIterators(lastSeen)
    val changed = its.foldLeft(Set.empty: Set[String]) { (acc, it) =>
      val getRecordsResult = dynamo.streamsClient.getRecords(
        new GetRecordsRequest().withShardIterator(it)
      )
      val records = getRecordsResult.getRecords().toList
      println(s"Records: ${records.length}")
      records map { record =>
        val keys = record.getDynamodb.getKeys.toMap
        keys  map {
          case (key, value) =>
            println(s"$key, $value")
        }
      }
      acc // XXX
    }
    changed.toList
  }
}
