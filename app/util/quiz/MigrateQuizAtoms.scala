package util.quiz

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder

import com.gu.scanamo._
import com.gu.scanamo.syntax._

case class QuizBuilderAtom(
  id: String,
  createdAt: Long,
  createdBy: String,
  defaultColumns: Int,
  published: Boolean,
  quizType: String,
  revealAtEnd: Boolean,
  revision: Int,
  title: String,
  updatedAt: Long,
  updatedBy: String,
  publishedAt: Long
)

object MigrateQuizAtoms extends App {
  val dbName = "QuizBuilderNewCODE_Quizzes"

  val creds = new ProfileCredentialsProvider("composer")
  val client = AmazonDynamoDBClientBuilder.standard().withRegion("eu-west-1").withCredentials(creds).build()

  val quiz = Scanamo.get[QuizBuilderAtom](client)(dbName)('id -> "881b28ec-05a9-4d33-b180-9d803354c376").get.right.get
  println(quiz.title)
}
