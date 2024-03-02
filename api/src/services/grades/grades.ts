import type {
  QueryResolvers,
  MutationResolvers,
  GradeRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const grades: QueryResolvers['grades'] = () => {
  return db.grade.findMany()
}

export const grade: QueryResolvers['grade'] = ({ id }) => {
  return db.grade.findUnique({
    where: { id },
  })
}

export const createGrade: MutationResolvers['createGrade'] = ({ input }) => {
  return db.grade.create({
    data: input,
  })
}

export const updateGrade: MutationResolvers['updateGrade'] = ({
  id,
  input,
}) => {
  return db.grade.update({
    data: input,
    where: { id },
  })
}

export const deleteGrade: MutationResolvers['deleteGrade'] = ({ id }) => {
  return db.grade.delete({
    where: { id },
  })
}

export const Grade: GradeRelationResolvers = {
  user: (_obj, { root }) => {
    return db.grade.findUnique({ where: { id: root?.id } }).user()
  },
  assignment: (_obj, { root }) => {
    return db.grade.findUnique({ where: { id: root?.id } }).assignment()
  },
}
