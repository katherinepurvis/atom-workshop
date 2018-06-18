package util.quiz

import java.nio.file.{Files, Path, Paths, StandardOpenOption}
import java.util.Locale

import com.gu.contentatom.thrift.{Atom, AtomData, AtomType}
import org.apache.http.HttpHost
import org.apache.thrift.protocol.TCompactProtocol
import org.apache.thrift.transport.TIOStreamTransport
import org.elasticsearch.action.admin.indices.create.CreateIndexRequest
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsRequest
import org.elasticsearch.action.admin.indices.get.GetIndexRequest
import org.elasticsearch.action.index.IndexRequest
import org.elasticsearch.client.{RestClient, RestHighLevelClient}
import org.elasticsearch.common.xcontent.{XContentBuilder, XContentFactory, XContentType}

import scala.collection.JavaConverters._

object ImportAtoms extends App {
  import ElasticsearchAtomMappings._

  val host = args(0)
  val port = args(1).toInt

  val files = Files.walk(Paths.get(".")).iterator().asScala
  val elasticsearch = new RestHighLevelClient(RestClient.builder(new HttpHost(host, port, "http")))

  mappings.foreach { case(atomType, _) =>
    createIndex(atomType, elasticsearch)
  }

  var count = 0

  files.foreach {
    case file if Files.isRegularFile(file) && file.toString.endsWith(".thrift") =>
      val atom = fromFile(file)
      val json = writers(atom.atomType)(atom)

      elasticsearch.index(new IndexRequest(indexFor(atom.atomType), "atom").id(atom.id).source(json))

      count += 1
      if(count % 100 == 0) { println(count) }

    case _ =>
      //
  }

  println("done")
  elasticsearch.close()

  private def createIndex(atomType: AtomType, elasticsearch: RestHighLevelClient): Unit = {
    val index = indexFor(atomType)

    if(elasticsearch.indices().exists(new GetIndexRequest().indices(index))) {
      elasticsearch.indices().delete(new DeleteIndexRequest().indices(index))
    }

    val createReq = new CreateIndexRequest(index).mapping("atom", mappings(atomType), XContentType.JSON)
    elasticsearch.indices().create(createReq)
  }

  private def fromFile(file: Path): Atom = {
    val is = Files.newInputStream(file, StandardOpenOption.READ)
    val transport = new TIOStreamTransport(is)
    val protocol = new TCompactProtocol(transport)
    val struct = Atom.decode(protocol)
    struct
  }
}

object ElasticsearchAtomMappings {
  val mappings: Map[AtomType, String] = Map(
    AtomType.Quiz ->
      """
        |{
        |  "properties": {
        |    "created":  { "type": "date" },
        |    "user":     { "type": "text" },
        |    "quizType": { "type": "text" },
        |    "title":    { "type": "text" }
        |   }
        |}
      """.stripMargin
  )

  val writers: Map[AtomType, Atom => XContentBuilder] = Map(
    AtomType.Quiz -> writeQuiz
  )

  def indexFor(atomType: AtomType): String = s"atom-$atomType".toLowerCase(Locale.UK)

  private def writeQuiz(atom: Atom): XContentBuilder = {
    val quiz = atom.data.asInstanceOf[AtomData.Quiz].quiz
    val created = atom.contentChangeDetails.created.get

    if(quiz.quizType != "knowledge") {
      println("")
    }

    val ret = XContentFactory.jsonBuilder()
    ret.startObject()
    ret.field("created", created.date)
    ret.field("user", created.user.map(_.email).getOrElse("unknown"))
    ret.field("quizType", quiz.quizType.toString)
    ret.field("title", quiz.title)
    ret.endObject()
    ret
  }
}
