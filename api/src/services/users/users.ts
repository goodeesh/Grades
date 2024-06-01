import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const getUserByEmail: QueryResolvers['getUserByEmail'] = ({ input }) => {
  return db.user.findUnique({
    where: { email: input.email },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const createUserForClass: MutationResolvers['createUserForClass'] = ({
  input,
}) => {
  return db.user.create({
    data: input,
  })
}

export const changueRole: MutationResolvers['changueRole'] = ({ input }) => {
  console.log('hi')
  return db.user.update({
    data: { role: input.role },
    where: { email: input.email },
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const setDarkModeForUser: MutationResolvers['setDarkModeForUser'] = ({
  input,
}) => {
  return db.user.update({
    data: { darkMode: input.darkMode },
    where: { id: input.id },
  })
}

export const User: UserRelationResolvers = {
  subjects: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).subjects()
  },
  studentsInSubject: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).studentsInSubject()
  },
  Subject: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Subject()
  },
  SubjectStudents: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).SubjectStudents()
  },
  Grades: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Grades()
  },
}
