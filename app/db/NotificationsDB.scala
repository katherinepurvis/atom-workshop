package db

import cats.implicits._

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.amazonaws.services.dynamodbv2.model.{AttributeValue, GetItemRequest}

import config.Config
import models.{Answer, QuestionAnswers, AtomAPIError}

import scala.collection.JavaConverters._

class NotificationsDB(dynamoDB: AmazonDynamoDBClient) {
  def getNotification(atomId: String, questionId: String): Either[AtomAPIError, Option[QuestionAnswers]] = {
    val key = Seq(
      "atomId" -> new AttributeValue().withS(atomId), 
      "questionId" -> new AttributeValue().withS(questionId)
    ).toMap.asJava
    val req = new GetItemRequest(Config.notificationsDynamoTableName, key)
    val res = Option(dynamoDB.getItem(req).getItem).map(_.asScala)
    
    Either.right(
      res
        .flatMap(_.get("answers"))
        .map { as =>
          val answers = as.getL().asScala.map { answer =>
            val details = answer.getM().asScala
            for {
              path <- details.get("answerPath").map(_.getS)
              `type` <- details.get("answerType").map(_.getS)
            } yield Answer(path, `type`)
          }.flatten

          QuestionAnswers(atomId, questionId, answers)
        }
    )
  }
}