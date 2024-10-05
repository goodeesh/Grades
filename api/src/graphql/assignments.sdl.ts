export const schema = gql`
  enum AssignmentType {
    GRADED
    COMPLETION
  }

  type Assignment {
    id: String!
    title: String!
    description: String
    createdAt: DateTime!
    dueDate: DateTime
    date: DateTime
    type: AssignmentType
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
    type: AssignmentType!
    subjectId: String!
  }

  input UpdateAssignmentInput {
    title: String!
    description: String
    date: DateTime!
    type: AssignmentType!
    subjectId: String
  }

  type Mutation {
    createAssignment(input: CreateAssignmentInput!): Assignment! @requireAuth
    updateAssignment(id: String!, input: UpdateAssignmentInput!): Assignment!
      @requireAuth
    deleteAssignment(id: String!): Assignment! @requireAuth
  }
`
