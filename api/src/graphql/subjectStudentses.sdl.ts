export const schema = gql`
  type SubjectStudents {
    id: String!
    subject: Subject!
    subjectId: String!
    User: User
    userId: String
  }

  type Query {
    subjectStudentses: [SubjectStudents!]! @requireAuth
    subjectStudents(id: Int!): SubjectStudents @requireAuth
  }

  input CreateSubjectStudentsInput {
    subjectId: String!
    userId: String!
  }

  input UpdateSubjectStudentsInput {
    subjectId: String!
    userId: String!
  }

  type Mutation {
    createSubjectStudents(input: CreateSubjectStudentsInput!): SubjectStudents!
      @requireAuth
    updateSubjectStudents(
      id: Int!
      input: UpdateSubjectStudentsInput!
    ): SubjectStudents! @requireAuth
    deleteSubjectStudents(id: Int!): SubjectStudents! @requireAuth
  }
`
