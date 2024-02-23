export const schema = gql`
  type User {
    id: String!
    email: String
    role: String!
    name: String!
    lastName: String!
    subjects: [Subject]!
    studentsInSubject: [Subject]!
    Subject: [Subject]!
    SubjectStudents: [SubjectStudents]!
    Grades: [Grade]!
  }

  input GetUserByEmail {
    email: String!
  }
  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
    getUserByEmail(input: GetUserByEmail!): User @requireAuth
  }

  input CreateUserInput {
    email: String
    role: String!
    name: String!
    lastName: String!
  }

  input UpdateUserInput {
    email: String
    role: String
    name: String
    lastName: String
  }

  input ChangueRoleInput {
    email: String!
    role: String!
  }

  input CreateUserInputForClass {
    email: String
    role: String!
    name: String!
    lastName: String!
    classId: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
    changueRole(input: ChangueRoleInput!): User! @requireAuth
    createUserForClass(input: CreateUserInputForClass!): User! @requireAuth
  }
`
