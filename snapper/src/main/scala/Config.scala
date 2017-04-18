package com.gu.atomworkshop.snapper

import com.amazonaws.regions.Regions 
import com.amazonaws.auth.profile.ProfileCredentialsProvider

case class Config(
  streamArn: String,
  authProfile: String,
  regionName: String
) {
  val authProvider = new ProfileCredentialsProvider("composer")
  val region = Regions.fromName(regionName)
}
