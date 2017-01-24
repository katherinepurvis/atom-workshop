package model

import org.cvogt.play.json.Jsonx

case class ClientConfig(
                         username: String
                       )

object ClientConfig {
  implicit val clientConfigFormat = Jsonx.formatCaseClass[ClientConfig]
}
