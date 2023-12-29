export const schema = gql`
  type User {
    id: Int!
    email: String!
    role: String
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
    user(id: Int!): User @requireAuth
    getUserByEmail(input: GetUserByEmail!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    role: String
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

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
    changueRole(input: ChangueRoleInput!): User! @requireAuth
  }
`
