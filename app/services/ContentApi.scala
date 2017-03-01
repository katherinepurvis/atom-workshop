package services

import java.util.concurrent.TimeUnit

import com.squareup.okhttp.{Credentials, OkHttpClient, Request, Response}
import config.Config

object ContentApi {
  val httpClient = new OkHttpClient()

  def requestPreviewPath(path: String): Option[Response] = {
    httpClient.setConnectTimeout(5, TimeUnit.SECONDS)

    for {
      capiPreviewUser <- Config.capiUsername
      capiPreviewPassword <- Config.capiPassword
      capiUrl <- Config.capiPreviewUrl
    } yield {
      val url = s"$capiUrl/$path"

      val req = new Request.Builder()
        .url(url)
        .header("Authorization", Credentials.basic(capiPreviewUser, capiPreviewPassword))
        .build

      httpClient.newCall(req).execute
    }
  }
}
