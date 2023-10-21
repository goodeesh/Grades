export const schema = gql`
  type Subject {
    id: Int!
    teacher: User!
    teacherId: Int!
    subjectName: String!
    students: [User]!
    studentsInSubject: [User]!
    subjectStudents: [SubjectStudents]!
  }

  type Query {
    subjects: [Subject!]! @requireAuth
    subject(id: Int!): Subject @requireAuth
  }

  input CreateSubjectInput {
    teacherId: Int!
    subjectName: String!
  }

  input UpdateSubjectInput {
    teacherId: Int
    subjectName: String
  }

  type Mutation {
    createSubject(input: CreateSubjectInput!): Subject! @requireAuth
    updateSubject(id: Int!, input: UpdateSubjectInput!): Subject! @requireAuth
    deleteSubject(id: Int!): Subject! @requireAuth
  }
`
