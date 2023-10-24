export const schema = gql`
  type SubjectStudents {
    id: Int!
    subject: Subject!
    subjectId: Int!
    User: User
    userId: String
  }

  type Query {
    subjectStudentses: [SubjectStudents!]! @requireAuth
    subjectStudents(id: Int!): SubjectStudents @requireAuth
  }

  input CreateSubjectStudentsInput {
    subjectId: Int!
    userId: String
  }

  input UpdateSubjectStudentsInput {
    subjectId: Int
    userId: String
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
