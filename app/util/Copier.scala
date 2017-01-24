package util
// stolen from https://gist.github.com/mslinn/a64b5152b2c035103a326d3f21ce2e79

//object CopierTest extends App {
//  case class X(a: String, id: Int)
//  val x = X("hi", 123)
//  val result = Copier(x, ("id", 456))
//  println(result)
//}

object Copier {
  def apply[T](o: T, vals: (String, Any)*): T = {
    val copier = new Copier(o.getClass)
    copier(o, vals: _*)
  }
}

/** Utility class for providing copying of a designated case class with minimal overhead. */
class Copier(cls: Class[_]) {
  import java.lang.reflect.Modifier

  private val ctor = cls.getConstructors.apply(0)
  private val getters = cls.getDeclaredFields
    .filter { f =>
      val m = f.getModifiers
      Modifier.isPrivate(m) && Modifier.isFinal(m) && !Modifier.isStatic(m)
    }
    .take(ctor.getParameterTypes.length)
    .map(f => cls.getMethod(f.getName))

  /** A reflective, non-generic version of case class copying. */
  def apply[T](o: T, vals: (String, Any)*): T = {
    val byIx = vals.map {
      case (name, value) =>
        val ix = getters.indexWhere(_.getName == name)
        if (ix < 0) throw new IllegalArgumentException("Unknown field: " + name)
        (ix, value.asInstanceOf[Object])
    }.toMap

    val args = getters.indices.map { i =>
      byIx.getOrElse(i, getters(i).invoke(o))
    }
    ctor.newInstance(args: _*).asInstanceOf[T]
  }
}