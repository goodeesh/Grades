import { gql } from '@apollo/client'

export const CREATE_SUBJECT = gql`
  mutation CreateSubjectMutation($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      teacherId
      subjectName
      subjectDescription
    }
  }
`
export const GET_SUBJECTS_FOR_TEACHER = gql`
  query GetSubjectsForTeacherQuery($teacherId: String!) {
    subjectsByTeacherId(teacherId: $teacherId) {
      id
      teacherId
      subjectName
      subjectDescription
      order
      archived
    }
  }
`
export const DELETE_SUBJECT = gql`
  mutation DeleteSubjectMutation($id: String!) {
    deleteSubject(id: $id) {
      id
    }
  }
`

export const UPDATE_ORDER_SUBJECTS = gql`
  mutation UpdateOrderSubjectsMutation($input: UpdateOrderSubjectsInput!) {
    updateOrderSubjects(input: $input) {
      id
      order
    }
  }
`

export const EDIT_SUBJECT = gql`
  mutation updateNameDescription(
    $id: String!
    $input: UpdateNameDescriptionInput!
  ) {
    updateNameDescription(id: $id, input: $input) {
      id
      teacherId
      subjectName
      subjectDescription
      order
      archived
    }
  }
`
