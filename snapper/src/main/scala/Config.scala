package com.gu.atomworkshop.snapper

import com.amazonaws.regions.Regions 
import com.amazonaws.auth.profile.ProfileCredentialsProvider

import com.amazonaws.services.dynamodbv2._

case class Config(
  tableName: String,
  authProfile: String,
  regionName: String
) {

  val authProvider = new ProfileCredentialsProvider("composer")
  val region = Regions.fromName(regionName)
}
