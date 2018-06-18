package util.quiz

import java.nio.file.{Files, Paths}

import com.gu.contentapi.client.GuardianContentClient
import com.gu.contentatom.thrift.Atom
import com.twitter.scrooge.ThriftStruct
import org.apache.thrift.protocol.TCompactProtocol
import org.apache.thrift.transport.TMemoryBuffer

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.control.NonFatal

object DumpAtoms extends App {
  val apiKey = args(0)
  val atomType = args(1)

  val pageSize = 50
  val initialBufferDefault = 128

  val client = new GuardianContentClient(apiKey)
  getPage(1)

  private def getPage(page: Int): Unit = {
    val req = client.atoms.types(atomType).page(page).pageSize(pageSize)
    client.getResponse(req).map { resp =>
      println(s"page $page of ${resp.pages}")

      resp.results.foreach(writeAtom)

      if(resp.currentPage < resp.pages) {
        getPage(page + 1)
      }
    }
  }

  private def writeAtom(atom: Atom): Unit = try {
    val path = Paths.get(s"${atom.atomType}-${atom.id}.thrift")

    if(Files.exists(path)) {
      Files.delete(path)
    }

    val bytes = toBytes(atom)
    Files.write(path, bytes)
  } catch {
    case NonFatal(e) =>
      println(e)
  }

  private def toBytes(struct: ThriftStruct, thriftBufferInitialSize: Option[Int] = None): Array[Byte] = {
    val bufferSize = thriftBufferInitialSize.getOrElse(initialBufferDefault)
    val buffer = new TMemoryBuffer(bufferSize)
    val protocol = new TCompactProtocol(buffer)
    struct.write(protocol)
    buffer.getArray
  }
}
