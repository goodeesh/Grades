export const schema = gql`
  type User {
    id: String!
    email: String!
    role: String!
    name: String!
    lastName: String!
    subjects: [Subject]!
    studentsInSubject: [Subject]!
    Subject: [Subject]!
    SubjectStudents: [SubjectStudents]!
    Grades: [Grade]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
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

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
