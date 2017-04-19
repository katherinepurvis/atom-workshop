package models

sealed trait Version

case object Draft extends Version
case object Preview extends Version
case object Live extends Version