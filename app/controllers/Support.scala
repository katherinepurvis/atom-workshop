package controllers

import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import services.ContentApi

class Support(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  def previewCapiProxy(path: String) = APIAuthAction { request =>

    val capiPath = s"$path?${request.rawQueryString}"

    ContentApi.requestPreviewPath(capiPath) match {
      case None =>
        InternalServerError("Could not construct CAPI request, check config has capi information")
      case Some(r) if r.code() == 200 =>
        Ok(r.body.string).as(JSON)
      case Some(r) =>
        BadRequest(s"CAPI returned status: ${r.code()}")
    }
  }
}
