package util.atomBuilders

import com.gu.draftcontentatom.thrift.{Atom, AtomType, ContentChangeDetails}
import models.CreateAtomFields

object DraftElementBuilder {

  def buildDraftContentChangeDetails(existingContentChangeDetails: Option[ContentChangeDetails]): ContentChangeDetails =
    ContentChangeDetails(
      revision = Some(existingContentChangeDetails.map(_.revision.getOrElse(0L)).getOrElse(0L) + 1))

  def buildDraft(atomType: AtomType, createAtomFields: Option[CreateAtomFields]): Atom = {
    val title = createAtomFields.flatMap(_.title)
    Atom(
      title = title,
      id = Some(java.util.UUID.randomUUID.toString),
      atomType = Some(atomType),
      contentChangeDetails = Some(buildDraftContentChangeDetails(None)))
  }
}
