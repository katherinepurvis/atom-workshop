package models

sealed abstract class AtomAPIError(val msg: String)

case object InvalidAtomTypeError extends AtomAPIError("Atom type not valid - did you make a typo? Correct examples: 'explainer', 'cta', 'media")
case object UnsupportedAtomTypeError extends AtomAPIError("Atom type not supported. Currently supported types: unknown")
case object DeleteAtomFromPreviewError extends AtomAPIError("Could not delete atom from preview. Atom is live.")
case class CreateAtomDynamoError(atomJson: String, message: String) extends AtomAPIError(s"Error thrown by Dynamo when attempting to create atom. JSON of atom: $atomJson, error message: $message")

case class AtomWorkshopDynamoDatastoreError(message: String) extends AtomAPIError(message)
