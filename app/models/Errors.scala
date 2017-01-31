package models

sealed abstract class AtomAPIError(val msg: String) extends Exception(msg)

case object InvalidAtomTypeError extends AtomAPIError("Atom type not valid - did you make a typo? Correct examples: 'explainer', 'cta', 'media")
case object UnsupportedAtomTypeError extends AtomAPIError("Atom type not supported. Currently supported types: unknown")
case class UnexpectedDynamoError(info: String) extends AtomAPIError(info)
case object UnknownAPIError extends AtomAPIError("Atom workshop API Threw an error! Sorry, I've no idea why")
