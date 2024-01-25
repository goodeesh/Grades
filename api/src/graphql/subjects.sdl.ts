export const schema = gql`
  type Subject {
    id: Int!
    teacher: User!
    teacherId: String!
    subjectName: String!
    subjectDescription: String!
    students: [User]!
    studentsInSubject: [User]!
    subjectStudents: [SubjectStudents]!
    grades: [Grade]!
  }

  type Query {
    subjects: [Subject!]! @requireAuth
    subject(id: Int!): Subject @requireAuth
    subjectsByTeacherId(teacherId: Int!): [Subject!]! @requireAuth
  }

  input subjectsByTeacherIdInput {
    teacherId: Int!
  }

  input CreateSubjectInput {
    teacherId: Int!
    subjectName: String!
    subjectDescription: String!
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
