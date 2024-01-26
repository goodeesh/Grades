import type {
  QueryResolvers,
  MutationResolvers,
  SubjectRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const subjectsByTeacherId: QueryResolvers['subjectsByTeacherId'] = ({
  teacherId,
}) => {
  return db.subject.findMany({
    where: { teacherId },
    orderBy: { order: 'asc' },
  })
}

export const subjects: QueryResolvers['subjects'] = () => {
  return db.subject.findMany()
}

export const subject: QueryResolvers['subject'] = ({ id }) => {
  return db.subject.findUnique({
    where: { id },
  })
}

export const createSubject: MutationResolvers['createSubject'] = async ({
  input,
}) => {
  type InputWithOrder = typeof input & { order: number }
  const subjects = (await subjectsByTeacherId({
    teacherId: input.teacherId,
  })) as InputWithOrder[]
  const maxOrder =
    subjects.length > 0
      ? Math.max(...subjects.map((subject) => subject.order))
      : 0
  const order = maxOrder + 1
  const inputWithOrder: InputWithOrder = {
    ...input,
    order: order,
  }
  return db.subject.create({
    data: inputWithOrder,
  })
}

export const updateSubject: MutationResolvers['updateSubject'] = async ({
  id,
  input,
}) => {
  return db.subject.update({
    data: input,
    where: { id },
  })
}

export const updateOrderSubject: MutationResolvers['updateOrderSubject'] =
  async ({ id, input }) => {
    return db.subject.update({
      data: { order: input.order },
      where: { id },
    })
  }
// export const deleteSubject: MutationResolvers['deleteSubject'] = ({ id }) => {
//   return db.subject.delete({
//     where: { id },
//   })
// }
export const deleteSubject: MutationResolvers['deleteSubject'] = async ({
  id,
}) => {
  const subjectToDelete = await db.subject.findUnique({ where: { id } })

  if (!subjectToDelete) {
    throw new Error('Subject not found')
  }

  const deletedSubject = await db.subject.delete({ where: { id } })

  // Reorder the remaining subjects
  const subjectsToReorder = await db.subject.findMany({
    where: { order: { gt: subjectToDelete.order } },
    orderBy: { order: 'asc' },
  })

  for (let i = 0; i < subjectsToReorder.length; i++) {
    await db.subject.update({
      where: { id: subjectsToReorder[i].id },
      data: { order: subjectToDelete.order + i },
    })
  }

  return deletedSubject
}

export const Subject: SubjectRelationResolvers = {
  teacher: (_obj, { root }) => {
    return db.subject.findUnique({ where: { id: root?.id } }).teacher()
  },
  students: (_obj, { root }) => {
    return db.subject.findUnique({ where: { id: root?.id } }).students()
  },
  studentsInSubject: (_obj, { root }) => {
    return db.subject
      .findUnique({ where: { id: root?.id } })
      .studentsInSubject()
  },
  subjectStudents: (_obj, { root }) => {
    return db.subject.findUnique({ where: { id: root?.id } }).subjectStudents()
  },
  grades: (_obj, { root }) => {
    return db.subject.findUnique({ where: { id: root?.id } }).grades()
  },
}
