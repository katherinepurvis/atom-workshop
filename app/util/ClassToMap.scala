package util

import com.gu.contentatom.thrift._
import com.gu.contentatom.thrift.AtomData.Media
import com.gu.contentatom.thrift.atom.media.MediaAtom
import controllers.MyContentChangeDetails
import shapeless.labelled._
import shapeless._

object ClassToMap {
  // FROM CASE CLASS TO MAP (http://stackoverflow.com/a/31638390)
  trait ToMapRec[L <: HList] {
    def apply(l: L): Map[String, Any]
  }

  // Case for heads that don't have ToMapRec instances (hconsToMapRec1).
  // Note that we need to use a LowPriority trait to make sure that this instance is
  // prioritized properly with respect to hconsToMapRec0—if we didn't, the two would have
  // the same priority and we'd get errors about ambiguous instances.
  trait LowPriorityToMapRec {
    implicit def hconsToMapRec1[K <: Symbol, V, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     tmrT: Lazy[ToMapRec[T]]
    ): ToMapRec[FieldType[K, V] :: T] = new ToMapRec[FieldType[K, V] :: T] {
      override def apply(l: FieldType[K, V] :: T): Map[String, Any] = {
        println("hconsToMapRec1", l.head, l.head.getClass)
        tmrT.value(l.tail) + (wit.value.name -> l.head)
      }
    }
  }

  object ToMapRec extends LowPriorityToMapRec {
    implicit val hNilToMapRec: ToMapRec[HNil] = new ToMapRec[HNil] {
      override def apply(l: HNil): Map[String, Any] = Map.empty
    }

//     Case where we know how to convert the tail of the record, and we know that
//     the head is something that we can also recursively convert
    implicit def hconsToMapRec0[K <: Symbol, V, R <: HList, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     gen: LabelledGeneric.Aux[V, R],
     tmrT: Lazy[ToMapRec[T]],
     tmrH: Lazy[ToMapRec[R]]
    ): ToMapRec[FieldType[K, V] :: T] = new ToMapRec[FieldType[K, V] :: T] {
      override def apply(l: FieldType[K, V] :: T): Map[String, Any] = {
        println("hconsToMapRec0", l.head, l.head.getClass)
        tmrT.value(l.tail) + (wit.value.name -> tmrH.value(gen.to(l.head)))
      }
    }

    implicit def hconsToMapRecOption[K <: Symbol, V, R <: HList, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     gen: LabelledGeneric.Aux[V, R],
     tmrT: Lazy[ToMapRec[T]],
     tmrH: Lazy[ToMapRec[R]]
    ): ToMapRec[FieldType[K, Option[V]] :: T] = new ToMapRec[FieldType[K, Option[V]] :: T] {
      override def apply(l: FieldType[K, Option[V]] :: T): Map[String, Any] = {
        println("hconsToMapRecOption", l.head, l.head.getClass)
        tmrT.value(l.tail) + (wit.value.name -> l.head.map(value => tmrH.value(gen.to(value))))
      }
    }

    implicit def hconsToMapRecCCD[K <: Symbol, V <: ContentChangeDetails, R <: HList, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     gen: LabelledGeneric.Aux[ContentChangeDetails.Immutable, R],
     tmrT: Lazy[ToMapRec[T]],
     tmrH: Lazy[ToMapRec[R]]
    ): ToMapRec[FieldType[K, V] :: T] = new ToMapRec[FieldType[K, V] :: T] {
      override def apply(l: FieldType[K, V] :: T): Map[String, Any] = {
        println("hconsToMapRecCCD", l.head, l.head.getClass)
        val instanceOfCCD = l.head.asInstanceOf[ContentChangeDetails.Immutable]
        println("hconsToMapRecCCD - asInstanceOf", instanceOfCCD, instanceOfCCD.getClass)
        println("hconsToMapRecCCD - gen", gen.to(instanceOfCCD), gen.to(instanceOfCCD).getClass)
        println("hconsToMapRecCCD - tmrH", tmrH.value(gen.to(instanceOfCCD)), tmrH.value(gen.to(instanceOfCCD)).getClass)
        tmrT.value(l.tail) + (wit.value.name -> tmrH.value(gen.to(l.head.asInstanceOf[ContentChangeDetails.Immutable])))
      }
    }

    implicit def hconsToMapRecFlags[K <: Symbol, V <: com.gu.contentatom.thrift.Flags, R <: HList, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     gen: LabelledGeneric.Aux[Flags.Immutable, R],
     tmrT: Lazy[ToMapRec[T]],
     tmrH: Lazy[ToMapRec[R]]
    ): ToMapRec[FieldType[K, V] :: T] = new ToMapRec[FieldType[K, V] :: T] {
      override def apply(l: FieldType[K, V] :: T): Map[String, Any] = {
        println("hconsToMapRecFlags", l.head, l.head.getClass)
        val instanceOfCCD = l.head.asInstanceOf[Flags.Immutable]
        println("hconsToMapRecFlags - asInstanceOf", instanceOfCCD, instanceOfCCD.getClass)
        println("hconsToMapRecFlags - gen", gen.to(instanceOfCCD), gen.to(instanceOfCCD).getClass)
        println("hconsToMapRecFlags - tmrH", tmrH.value(gen.to(instanceOfCCD)), tmrH.value(gen.to(instanceOfCCD)).getClass)
        tmrT.value(l.tail) + (wit.value.name -> tmrH.value(gen.to(l.head.asInstanceOf[Flags.Immutable])))
      }
    }


    implicit def hconsToMapRecChangeRecord[K <: Symbol, V <: ChangeRecord, R <: HList, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     gen: LabelledGeneric.Aux[ChangeRecord.Immutable, R],
     tmrT: Lazy[ToMapRec[T]],
     tmrH: Lazy[ToMapRec[R]]
    ): ToMapRec[FieldType[K, V] :: T] = new ToMapRec[FieldType[K, V] :: T] {
      override def apply(l: FieldType[K, V] :: T): Map[String, Any] = {
        println("hconsToMapRecChangeRecord", l.head, l.head.getClass)
        tmrT.value(l.tail) + (wit.value.name -> tmrH.value(gen.to(l.head.asInstanceOf[ChangeRecord.Immutable])))
      }
    }
//
//    implicit def hconsToMapRecUser[K <: Symbol, V, R <: HList, T <: HList]
//    (implicit
//     wit: Witness.Aux[K],
//     gen: LabelledGeneric.Aux[User.Immutable, R],
//     tmrT: Lazy[ToMapRec[T]],
//     tmrH: Lazy[ToMapRec[R]]
//    ): ToMapRec[FieldType[K, User] :: T] = new ToMapRec[FieldType[K, User] :: T] {
//      override def apply(l: FieldType[K, User] :: T): Map[String, Any] = {
//        println("hconsToMapRecUser", l.head, l.head.getClass)
//        tmrT.value(l.tail) + (wit.value.name -> tmrH.value(gen.to(l.head.asInstanceOf[User.Immutable])))
//      }
//    }
//
//    implicit def hconsToMapRecMedia[K <: Symbol, V, R <: HList, T <: HList]
//    (implicit
//     wit: Witness.Aux[K],
//     gen: LabelledGeneric.Aux[MediaAtom.Immutable, R],
//     tmrT: Lazy[ToMapRec[T]],
//     tmrH: Lazy[ToMapRec[R]]
//    ): ToMapRec[FieldType[K, AtomData.Media] :: T] = new ToMapRec[FieldType[K, AtomData.Media] :: T] {
//      override def apply(l: FieldType[K, AtomData.Media] :: T): Map[String, Any] = {
//        println("hconsToMapRecMedia", l.head, l.head.getClass)
//        tmrT.value(l.tail) + (wit.value.name -> tmrH.value(gen.to(l.head.media.asInstanceOf[MediaAtom.Immutable])))
//      }
//    }
  }

  implicit class ToMapRecOps[A](val a: A) extends AnyVal {
    def toMap[L <: HList]
    (implicit
     gen: LabelledGeneric.Aux[A, L],
     tmr: Lazy[ToMapRec[L]]
    ): Map[String, Any] = tmr.value(gen.to(a))
  }
}
