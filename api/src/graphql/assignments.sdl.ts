export const schema = gql`
  type Assignment {
    id: String!
    title: String!
    description: String
    createdAt: DateTime!
    dueDate: DateTime
    date: DateTime
    subject: Subject!
    subjectId: String!
    grades: [Grade]!
  }

  type Query {
    assignments: [Assignment!]! @requireAuth
    assignment(id: String!): Assignment @requireAuth
  }

  input CreateAssignmentInput {
    title: String!
    description: String
    date: DateTime!
    subjectId: String!
  }

  input UpdateAssignmentInput {
    title: String!
    description: String
    date: DateTime!
    subjectId: String
  }

  type Mutation {
    createAssignment(input: CreateAssignmentInput!): Assignment! @requireAuth
    updateAssignment(id: String!, input: UpdateAssignmentInput!): Assignment!
      @requireAuth
    deleteAssignment(id: String!): Assignment! @requireAuth
  }
`
