export const schema = gql`
  type Grade {
    id: String!
    grade: Int!
    date: String!
    user: User!
    userId: String!
    assignment: Assignment!
    assignmentId: String!
  }

  type Query {
    grades: [Grade!]! @requireAuth
    grade(id: String!): Grade @requireAuth
  }

  input CreateGradeInput {
    grade: Int!
    date: String!
    userId: String!
    assignmentId: String!
  }

  input UpdateGradeInput {
    grade: Int
    date: String
    userId: String
    assignmentId: String
  }

  input createOrUpdateGradeInput {
    grade: Int!
    date: String!
    userId: String!
    assignmentId: String!
  }

  type Mutation {
    createGrade(input: CreateGradeInput!): Grade! @requireAuth
    updateGrade(id: String!, input: UpdateGradeInput!): Grade! @requireAuth
    deleteGrade(id: String!): Grade! @requireAuth
    createOrUpdateGrade(input: createOrUpdateGradeInput!): Grade! @requireAuth
  }
`
