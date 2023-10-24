export const schema = gql`
  type Subject {
    id: Int!
    teacher: User!
    teacherId: String!
    subjectName: String!
    students: [User]!
    studentsInSubject: [User]!
    subjectStudents: [SubjectStudents]!
    grades: [Grade]!
  }

  type Query {
    subjects: [Subject!]! @requireAuth
    subject(id: Int!): Subject @requireAuth
  }

  input CreateSubjectInput {
    teacherId: String!
    subjectName: String!
  }

  input UpdateSubjectInput {
    teacherId: String
    subjectName: String
  }

  type Mutation {
    createSubject(input: CreateSubjectInput!): Subject! @requireAuth
    updateSubject(id: Int!, input: UpdateSubjectInput!): Subject! @requireAuth
    deleteSubject(id: Int!): Subject! @requireAuth
  }
`
