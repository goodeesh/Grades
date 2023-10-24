import type {
  QueryResolvers,
  MutationResolvers,
  SubjectStudentsRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const subjectStudentses: QueryResolvers['subjectStudentses'] = () => {
  return db.subjectStudents.findMany()
}

export const subjectStudents: QueryResolvers['subjectStudents'] = ({ id }) => {
  return db.subjectStudents.findUnique({
    where: { id },
  })
}

export const createSubjectStudents: MutationResolvers['createSubjectStudents'] =
  ({ input }) => {
    return db.subjectStudents.create({
      data: input,
    })
  }

export const updateSubjectStudents: MutationResolvers['updateSubjectStudents'] =
  ({ id, input }) => {
    return db.subjectStudents.update({
      data: input,
      where: { id },
    })
  }

export const deleteSubjectStudents: MutationResolvers['deleteSubjectStudents'] =
  ({ id }) => {
    return db.subjectStudents.delete({
      where: { id },
    })
  }

export const SubjectStudents: SubjectStudentsRelationResolvers = {
  subject: (_obj, { root }) => {
    return db.subjectStudents.findUnique({ where: { id: root?.id } }).subject()
  },
  User: (_obj, { root }) => {
    return db.subjectStudents.findUnique({ where: { id: root?.id } }).User()
  },
}
