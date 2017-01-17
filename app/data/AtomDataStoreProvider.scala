package data

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.gu.atom.data.DynamoDataStore
import com.gu.contentatom.thrift.{Atom, AtomData}
import javax.inject.Provider

import com.gu.scanamo.DynamoFormat
import com.gu.atom.data.{PreviewDataStore, PreviewDynamoDataStore}
import com.gu.contentatom.thrift.atom.explainer._
import com.gu.contentatom.thrift._
import config.Config
import DynamoFormat._
import com.amazonaws.services.dynamodbv2.model.{AttributeValue, PutItemResult}
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.gu.contentatom.thrift.{Atom, AtomData, Flags}
import com.gu.scanamo.{DynamoFormat, Scanamo, Table}
import com.gu.scanamo.query._


import scala.reflect.ClassTag
import com.twitter.scrooge.ThriftStruct
import DynamoFormat._
import com.gu.scanamo.scrooge.ScroogeDynamoFormat._
import AtomData._
import com.gu.atom.data._
import ScanamoUtil._
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.media.MediaAtom
import com.gu.contentatom.thrift.atom.quiz.QuizAtom
import com.gu.scanamo.scrooge.ScroogeDynamoFormat._

//class PreviewAtomDataStore extends PreviewDataStore{
////  override def get(): PreviewDataStore = new PreviewDynamoDataStore[ExplainerAtom](Config.dynamoDB, Config.previewDynamoTableName) {
////    override def fromAtomData = {case AtomData.Explainer(data) => data}
////    override def toAtomData(data: ExplainerAtom): AtomData = AtomData.Explainer(data)
////  }
//  override def getAtom(id: String): Option[Atom] = ???
//
//  override def createAtom(atom: Atom): DataStoreResult[Unit] = ???
//
//  override def listAtoms: DataStoreResult[Iterator[Atom]] = ???
//
//  override def updateAtom(newAtom: Atom): DataStoreResult[Unit] = ???
//}

class PreviewAtomDataStore(dynamo: AmazonDynamoDBClient, tableName: String) extends PreviewDynamoDataStore[QuizAtom](dynamo, tableName) {
  override def fromAtomData = {case AtomData.Quiz(data) => data}
  override def toAtomData(data: QuizAtom) = AtomData.Quiz(data)
}