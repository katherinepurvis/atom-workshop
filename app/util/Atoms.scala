package util

import com.gu.contentatom.thrift.{Atom, AtomType}
import models._


object Atoms {
  def getVersion(version: String): Version = version match {
    case "preview" => Preview
    case "live" => Live
  }

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

  def checkAtomCanBeDeletedFromPreview(responseFromLiveDatastore:Either[AtomAPIError, Atom]): Either[AtomAPIError, Unit] =
    responseFromLiveDatastore.fold(_ => Right(), _ => Left(DeleteAtomFromPreviewError))
}