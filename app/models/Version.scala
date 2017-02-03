package models

sealed trait Version

case object Preview extends Version
case object Live extends Version