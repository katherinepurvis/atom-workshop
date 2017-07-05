package util

import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.{DisplayType, ExplainerAtom}
import com.gu.contentatom.thrift.atom.recipe.{RecipeAtom, Tags => RecipeTags, Time => RecipeTime}
import com.gu.contentatom.thrift.atom.storyquestions.{RelatedStoryLinkType, StoryQuestionsAtom}
import com.gu.contentatom.thrift.atom.qanda.{QAndAAtom, QAndAItem}
import com.gu.contentatom.thrift.atom.profile.ProfileAtom
import com.gu.contentatom.thrift.atom.guide.GuideAtom
import com.gu.contentatom.thrift.atom.timeline.TimelineAtom
import com.gu.contentatom.thrift.{User, _}
import com.gu.pandomainauth.model.{User => PandaUser}
import models.CreateAtomFields
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

object AtomElementBuilders {

  def buildContentChangeDetails(user: PandaUser, existingContentChangeDetails: Option[ContentChangeDetails], updateCreated: Boolean = false,
    updateLastModified: Boolean = false, updatePublished: Boolean = false, updateTakenDown: Boolean = false): ContentChangeDetails = {

    def pandaUserToAtomUser(user: PandaUser): User = {
      User(user.email, Some(user.firstName), Some(user.lastName))
    }
    def buildChangeRecord(existingRecord: Option[ChangeRecord], shouldUpdate: Boolean) = {
      if (shouldUpdate) {
        Some(ChangeRecord(DateTime.now.getMillis, user=Some(pandaUserToAtomUser(user))))
      } else if (existingRecord.isDefined) existingRecord else None
    }
    ContentChangeDetails(
      created      = buildChangeRecord(existingContentChangeDetails.flatMap(_.created)     , updateCreated),
      lastModified = buildChangeRecord(existingContentChangeDetails.flatMap(_.lastModified), updateLastModified),
      published    = buildChangeRecord(existingContentChangeDetails.flatMap(_.published)   , updatePublished),
      takenDown    = buildChangeRecord(existingContentChangeDetails.flatMap(_.takenDown)   , updateTakenDown),
      revision     = existingContentChangeDetails.map(_.revision).getOrElse(0L) + 1
    )
  }

  def buildDefaultAtom(atomType: AtomType, user: PandaUser, createAtomFields: Option[CreateAtomFields]): Atom = {
    val title = createAtomFields.flatMap(_.title).getOrElse("-")
    val defaultAtoms: Map[AtomType, AtomData] = Map(
      AtomType.Explainer -> AtomData.Explainer(ExplainerAtom(title, "-", DisplayType.Flat)),
      AtomType.Cta -> AtomData.Cta(CTAAtom("-")),
      AtomType.Recipe -> AtomData.Recipe(RecipeAtom(title, RecipeTags(), RecipeTime())),
      AtomType.Storyquestions -> AtomData.Storyquestions(StoryQuestionsAtom("(None)", RelatedStoryLinkType.Tag, title)),
      AtomType.Qanda -> AtomData.Qa(QAndAAtom(Some("Q&A"), None, QAndAItem(None, "Body"), None)),
      AtomType.Guide -> AtomData.Guide(GuideAtom(None, None, Nil)),
      AtomType.Profile -> AtomData.Profile(ProfileAtom(None, None, Nil, None)),
      AtomType.Timeline -> AtomData.Timeline(TimelineAtom())
    )

    Atom(
      title = createAtomFields.flatMap(_.title),
      id = java.util.UUID.randomUUID.toString,
      atomType = atomType,
      defaultHtml = createAtomFields.flatMap(_.defaultHtml).getOrElse(buildDefaultHtml(atomType = atomType, atomData = defaultAtoms(atomType))),
      data = defaultAtoms(atomType),
      contentChangeDetails = buildContentChangeDetails(user, None, updateCreated = true)
    )
  }

  def buildDefaultHtml(atomType: AtomType, atomData: AtomData): String = {
    s"""<div class="atom-${atomType.name}">${buildHtml(atomType, atomData).getOrElse("")}</div>"""
  }

  def buildHtml(atomType: AtomType, atomData: AtomData): Option[String] = atomType match {
    case AtomType.Storyquestions => buildStoryQuestionsHtml(atomData.asInstanceOf[AtomData.Storyquestions].storyquestions)
    case AtomType.Guide          => buildGuideHtml(atomData.asInstanceOf[AtomData.Guide].guide)
    case AtomType.Profile        => buildProfileHtml(atomData.asInstanceOf[AtomData.Profile].profile)
    case AtomType.Qanda          => buildQAndAHtml(atomData.asInstanceOf[AtomData.Qanda].qanda)
    case AtomType.Timeline       => buildTimelineHtml(atomData.asInstanceOf[AtomData.Timeline].timeline)
    case _ => None
  }

  def buildStoryQuestionsHtml(storyquestions: StoryQuestionsAtom): Option[String] = for {
    eqs <- storyquestions.editorialQuestions
  } yield {
    val list = eqs flatMap (_.questions map { q => s"<li>${q.questionText}</li>" }) mkString ""
    "<ul>" ++ list ++ "</ul>"
  }

  def buildGuideHtml(atom: GuideAtom): Option[String] =
    Some(
      atom.items.map{ item =>
        item.title.map(title => s"<p><strong>$title</strong></p>").getOrElse("") ++
        s"<p>${item.body}</p>"
      }.mkString("")
    )

  def buildProfileHtml(atom: ProfileAtom): Option[String] =
    Some(
      atom.items.map{ item =>
        item.title.map(title => s"<p><strong>$title</strong></p>").getOrElse("") ++
        s"<p>${item.body}</p>"
      }.mkString("")
    )

  def buildQAndAHtml(atom: QAndAAtom): Option[String] =
    Some(atom.item).map { item =>
      item.title.map(title => s"<p><strong>$title</strong></p>").getOrElse("") ++
      s"<p>${item.body}</p>"
    }

  def buildTimelineHtml(atom: TimelineAtom): Option[String] =
    Some(
      atom.events.map{ item =>
        val date = new DateTime(item.date)
        s"<p>(${DateTimeFormat.longDate.print(date)})<strong>$item.title</strong></p>" ++
        item.body.map(body => s"<p>${body}</p>").getOrElse("")
      }.mkString("")
    )
}
