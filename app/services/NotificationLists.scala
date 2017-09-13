package services

import cats.implicits._
import com.gu.contentatom.thrift.{Atom, AtomData, EmailProvider, NotificationProviders}
import com.gu.exact_target_lists.ExactTargetLists
import config.Config
import models.{AtomAPIError, NotificationListsError}

object NotificationLists {

  private val exactTargetLists: Either[NotificationListsError, ExactTargetLists] = {
    Config.exactTargetConfig match {
      case Some(config) => Either.right(new ExactTargetLists(config))
      case None => Either.left(NotificationListsError(s"Exact Target is not configured to run."))
    }
  }

  def createNotificationList(atom: Atom): Either[AtomAPIError, Atom] = atom.data match {
    case AtomData.Storyquestions(data) if data.notifications.isEmpty =>
      createNotificationList(data.title, atom.id).map { listId =>
        val updatedData = data.copy(notifications = Some(NotificationProviders(email = Some(EmailProvider(listId = listId.toString)))))
        atom.copy(data = AtomData.Storyquestions(updatedData))
      }
    case _ => Either.right(atom)
  }

  def deleteNotificationList(atom: Atom): Either[AtomAPIError, Atom] = atom.data match {
    case AtomData.Storyquestions(data) if data.notifications.isDefined =>
      val result = for {
        notifications <- data.notifications
        email <- notifications.email
        listId = email.listId
      } yield {
        val updatedData = data.copy(notifications = None)
        deleteNotificationList(listId.toInt).map { _ =>
          atom.copy(data = AtomData.Storyquestions(updatedData))
        }
      }
      result.getOrElse(Either.right(atom))

    case _ => Either.right(atom)
  }

  private def createNotificationList(title: String, id: String): Either[AtomAPIError, Int] =
    exactTargetLists.flatMap(_.createExactTargetList(title, Some(id))
      .left.map(e => NotificationListsError(e.message)))


  private def deleteNotificationList(listId: Int): Either[AtomAPIError, Int] =
    exactTargetLists.flatMap(_.deleteExactTargetList(listId)
      .left.map(e => NotificationListsError(e.message)))
}
