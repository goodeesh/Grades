import { gql } from '@apollo/client'

export const GET_SUBJECT_BY_ID = gql`
  query Subject($id: String!) {
    subject(id: $id) {
      id
      teacher {
        id
        name
      }
      students {
        id
        name
        lastName
      }
      assignments {
        id
        title
        description
        createdAt
        date
        grades {
          id
          userId
          grade
          date
        }
      }
    }
  }
`
export const CREATE_NEW_ASSIGNMENT = gql`
  mutation CreateNewAssignment($input: CreateAssignmentInput!) {
    createAssignment(input: $input) {
      id
      title
    }
  }
`

export const UPDATE_ASSIGNMENT = gql`
  mutation updateAssignment($id: String!, $input: UpdateAssignmentInput!) {
    updateAssignment(id: $id, input: $input) {
      id
      title
    }
  }
`

export const CREATE_GRADE = gql`
  mutation CreateGrade($input: CreateGradeInput!) {
    createGrade(input: $input) {
      id
      grade
    }
  }
`
export const UPDATE_GRADE = gql`
  mutation UpdateGrade($id: String!, $input: UpdateGradeInput!) {
    updateGrade(id: $id, input: $input) {
      id
      grade
    }
  }
`

export const CREATE_STUDENT = gql`
  mutation CreateStudent($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
    }
  }
`

export const CREATE_USER_SUBJECT = gql`
  mutation createSubjectStudents($input: CreateSubjectStudentsInput!) {
    createSubjectStudents(input: $input) {
      subjectId
      userId
    }
  }
`

export const DELETE_ASSIGNMENT = gql`
  mutation DeleteAssignment($id: String!) {
    deleteAssignment(id: $id) {
      id
    }
  }
`
