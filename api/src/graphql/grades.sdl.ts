export const schema = gql`
  type Grade {
    id: Int!
    assignment: Assignment!
    assignmentId: String!
    User: User!
    userId: String!
    grade: Int!
    date: String!
  }

  type Query {
    grades: [Grade!]! @requireAuth
    grade(id: Int!): Grade @requireAuth
  }

  input CreateGradeInput {
    subjectId: String!
    userId: String!
    grade: Int!
    date: String!
  }

  input UpdateGradeInput {
    assignmentId: Int
    userId: String
    grade: Int
    date: String
  }

  type Mutation {
    createGrade(input: CreateGradeInput!): Grade! @requireAuth
    updateGrade(id: Int!, input: UpdateGradeInput!): Grade! @requireAuth
    deleteGrade(id: Int!): Grade! @requireAuth
  }
`
