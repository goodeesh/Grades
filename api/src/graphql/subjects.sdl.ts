export const schema = gql`
  type Subject {
    id: String!
    teacher: User!
    teacherId: String!
    subjectName: String!
    subjectDescription: String!
    order: Int
    archived: Boolean!
    students: [User]!
    studentsInSubject: [User]!
    subjectStudents: [SubjectStudents]!
    grades: [Grade]!
  }

  type Query {
    subjects: [Subject!]! @requireAuth
    subject(id: String!): Subject @requireAuth
    subjectsByTeacherId(teacherId: String!): [Subject!]! @requireAuth
  }

  type Mutation {
    createSubject(input: CreateSubjectInput!): Subject! @requireAuth
    updateSubject(id: String!, input: UpdateSubjectInput!): Subject!
      @requireAuth
    deleteSubject(id: String!): Subject! @requireAuth
    updateOrderSubject(id: String!, input: UpdateOrderSubjectInput!): Subject!
      @requireAuth
    updateNameDescription(
      id: String!
      input: UpdateNameDescriptionInput!
    ): Subject! @requireAuth
  }

  input UpdateNameDescriptionInput {
    subjectName: String!
    subjectDescription: String!
  }

  input UpdateOrderSubjectInput {
    order: Int!
  }

  input subjectsByTeacherIdInput {
    teacherId: String!
  }

  input CreateSubjectInput {
    teacherId: String!
    subjectName: String!
    subjectDescription: String!
  }

  input UpdateSubjectInput {
    teacherId: String
    subjectName: String
    subjectDescription: String
    order: Int
    archived: Boolean
  }
`
