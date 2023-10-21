import type {
  QueryResolvers,
  MutationResolvers,
  SubjectRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const subjects: QueryResolvers['subjects'] = () => {
  return db.subject.findMany()
}

export const subject: QueryResolvers['subject'] = ({ id }) => {
  return db.subject.findUnique({
    where: { id },
  })
}

export const createSubject: MutationResolvers['createSubject'] = ({
  input,
}) => {
  return db.subject.create({
    data: input,
  })
}

export const updateSubject: MutationResolvers['updateSubject'] = ({
  id,
  input,
}) => {
  return db.subject.update({
    data: input,
    where: { id },
  })
}

export const deleteSubject: MutationResolvers['deleteSubject'] = ({ id }) => {
  return db.subject.delete({
    where: { id },
  })
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
}
