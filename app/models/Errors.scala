package models

sealed abstract class AtomAPIError(val msg: String)

case object InvalidAtomTypeError extends AtomAPIError("Atom type not valid - did you make a typo? Correct examples: 'explainer', 'cta', 'media")
case object UnsupportedAtomTypeError extends AtomAPIError("Atom type not supported. Currently supported types: unknown")
case class AmazonDynamoError(message: String) extends AtomAPIError(s"Error thrown by Dynamo: $message")
case class AtomWorkshopDynamoDatastoreError(message: String) extends AtomAPIError(message)
case class AtomJsonParsingError(message: String) extends AtomAPIError(s"Failed to parse Json string with error: $message")
case class AtomThriftDeserialisingError(message: String) extends AtomAPIError(s"Failed to deserialise JSON into thrift with error: $message")
case object UnexpectedExceptionError extends AtomAPIError("Atom workshop hit an exception it didn't expect. Please try again!")

