package models

import com.gu.contentatom.thrift.atom.storyquestions.{ Answer => ThriftAnswer, Question => ThriftQuestion }
import io.circe.Encoder
import io.circe.generic.semiauto._

case class Answer(answerPath: String, answerType: String)
case class QuestionAnswers(atomId: String, questionId: String, answers: Seq[Answer])

object Answer {
  def fromThrift(thrift: ThriftAnswer) = Answer(thrift.answerId, thrift.answerType.name)
  implicit val encoder: Encoder[Answer] = deriveEncoder
}

object QuestionAnswers {
  def fromThrift(atomId: String, thrift: ThriftQuestion) = QuestionAnswers(
    atomId = atomId,
    questionId = thrift.questionId,
    answers = thrift.answers.map(Answer.fromThrift))
  implicit val encoder: Encoder[QuestionAnswers] = deriveEncoder
}
