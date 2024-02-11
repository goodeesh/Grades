import type {
  QueryResolvers,
  MutationResolvers,
  AssignmentRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const assignments: QueryResolvers['assignments'] = () => {
  return db.assignment.findMany()
}

export const assignment: QueryResolvers['assignment'] = ({ id }) => {
  return db.assignment.findUnique({
    where: { id },
  })
}

export const createAssignment: MutationResolvers['createAssignment'] = ({
  input,
}) => {
  return db.assignment.create({
    data: input,
  })
}

export const updateAssignment: MutationResolvers['updateAssignment'] = ({
  id,
  input,
}) => {
  return db.assignment.update({
    data: input,
    where: { id },
  })
}

export const deleteAssignment: MutationResolvers['deleteAssignment'] = ({
  id,
}) => {
  return db.assignment.delete({
    where: { id },
  })
}

export const Assignment: AssignmentRelationResolvers = {
  subject: (_obj, { root }) => {
    return db.assignment.findUnique({ where: { id: root?.id } }).subject()
  },
  grades: (_obj, { root }) => {
    return db.assignment.findUnique({ where: { id: root?.id } }).grades()
  },
}
