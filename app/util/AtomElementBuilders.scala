package util

import com.gu.contentatom.thrift.atom.cta.CTAAtom
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
      AtomType.Cta -> AtomData.Cta(CTAAtom("-")),
      AtomType.Recipe -> AtomData.Recipe(RecipeAtom(title, RecipeTags(), RecipeTime())),
      AtomType.Storyquestions -> AtomData.Storyquestions(StoryQuestionsAtom("(None)", RelatedStoryLinkType.Tag, title)),
      AtomType.Qanda -> AtomData.Qanda(QAndAAtom(Some("Q&A"), None, QAndAItem(None, "Body"), None)),
      AtomType.Guide -> AtomData.Guide(GuideAtom(None, None, Nil)),
      AtomType.Profile -> AtomData.Profile(ProfileAtom(None, None, Nil, None)),
      AtomType.Timeline -> AtomData.Timeline(TimelineAtom())
    )

    Atom(
      title = createAtomFields.flatMap(_.title),
      commissioningDesks = createAtomFields.map(_.commissioningDesks).getOrElse(Nil),
      id = java.util.UUID.randomUUID.toString,
      atomType = atomType,
      defaultHtml = createAtomFields.flatMap(_.defaultHtml).getOrElse(""),
      data = defaultAtoms(atomType),
      contentChangeDetails = buildContentChangeDetails(user, None, updateCreated = true)
    )
  }
}
