name := "atom-workshop"
version := "1.0"

scalaVersion := "2.11.8"

lazy val awsVersion = "1.11.77"

libraryDependencies ++= Seq(
  ws,
  "com.amazonaws" % "aws-java-sdk-core" % awsVersion,
  "com.gu" % "kinesis-logback-appender" % "1.3.0",
  "com.amazonaws" % "aws-java-sdk-ec2" % awsVersion,
  "net.logstash.logback" % "logstash-logback-encoder" % "4.2",
  "com.gu" %% "configuration-magic-core" %  "1.3.0",
  "com.gu" %% "pan-domain-auth-play_2-5" % "0.4.1",
  "com.gu" %% "atom-publisher-lib" % "0.1.8",
  "com.gu" %% "atom-manager-play" % "0.1.8",
  "com.gu" %% "scanamo" % "0.9.0",
  "com.gu" %% "scanamo-scrooge" % "0.1.3",
  "org.typelevel" %% "cats-core" % "0.9.0" // for interacting with scanamo
)
routesGenerator := InjectedRoutesGenerator

import com.typesafe.sbt.packager.archetypes.ServerLoader.Systemd
serverLoading in Debian := Systemd

lazy val root = (project in file(".")).enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    name in Universal := normalizedName.value,
    topLevelDirectory := Some(normalizedName.value),
    riffRaffPackageName := name.value,
    riffRaffManifestProjectName := s"editorial-tools:${name.value}",
    riffRaffBuildIdentifier :=  Option(System.getenv("BUILD_NUMBER")).getOrElse("DEV"),
    riffRaffUploadArtifactBucket := Option("riffraff-artifact"),
    riffRaffUploadManifestBucket := Option("riffraff-builds"),
    riffRaffManifestBranch := Option(System.getenv("BRANCH_NAME")).getOrElse("unknown_branch"),

    riffRaffPackageType := (packageBin in Debian).value,

    debianPackageDependencies := Seq("openjdk-8-jre-headless"),
    maintainer := "Editorial Tools <digitalcms.dev@guardian.co.uk>",
    packageSummary := "Atom Workshop",
    packageDescription := """A single place for atoms of all types""",

    riffRaffArtifactResources ++= Seq(
      baseDirectory.value / "cloudformation" / "AtomWorkshop.yml" -> s"packages/cloudformation/AtomWorkshop.yml"
    ),
    javaOptions in Universal ++= Seq(
      "-Dpidfile.path=/dev/null"
    )
  )