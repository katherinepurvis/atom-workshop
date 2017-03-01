package controllers

import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import com.squareup.okhttp.{Credentials, OkHttpClient, Request}
import config.Config
import java.util.concurrent.TimeUnit



class Support(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  def previewCapiProxy(path: String) = APIAuthAction { request =>
    val httpClient = new OkHttpClient()
    httpClient.setConnectTimeout(5, TimeUnit.SECONDS)

    val resp = for {
      capiPreviewUser <- Config.capiUsername
      capiPreviewPassword <- Config.capiPassword
      capiUrl <- Config.capiPreviewUrl
    } yield {
      val url = s"$capiUrl/$path?${request.rawQueryString}"
      
      val req = new Request.Builder()
        .url(url)
        .header("Authorization", Credentials.basic(capiPreviewUser, capiPreviewPassword))
        .build

      httpClient.newCall(req).execute
    }

    resp match {
      case None =>
        InternalServerError("Could not construct CAPI request, check config has capi information")
      case Some(r) if r.code() == 200 =>
        Ok(r.body.string).as(JSON)
      case Some(r) =>
        BadRequest(s"CAPI returned status: ${r.code()}")
    }
  }
}
