import { useMutation, useQuery } from '@redwoodjs/web'

import {
  CREATE_SUBJECT,
  GET_SUBJECTS_FOR_TEACHER,
  DELETE_SUBJECT,
  UPDATE_ORDER_SUBJECTS,
  EDIT_SUBJECT,
} from './ClassPageQueries' // Assuming you've moved the queries to a separate file

export const useSubjectQueries = (
  teacherId: string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  // Query to get subjects for a teacher
  const {
    data: subjectsData,
    loading: subjectsLoading,
    refetch: refetchSubjects,
  } = useQuery(GET_SUBJECTS_FOR_TEACHER, {
    variables: { teacherId },
    onError: () => onError('Failed to fetch subjects'),
  })

  // Mutation to create a new subject
  const [createSubject] = useMutation(CREATE_SUBJECT, {
    onCompleted: () => {
      onSuccess('New class created successfully!')
      refetchSubjects()
    },
    onError: () => onError('Failed to create new class'),
  })

  // Mutation to delete a subject
  const [deleteSubject] = useMutation(DELETE_SUBJECT, {
    onCompleted: () => {
      onSuccess('Class deleted successfully!')
      refetchSubjects()
    },
    onError: () => onError('Failed to delete class'),
  })

  // Mutation to update subject order
  const [updateOrderSubjects] = useMutation(UPDATE_ORDER_SUBJECTS, {
    onCompleted: () => onSuccess('Class order updated successfully!'),
    onError: () => onError('Failed to update class order'),
  })

  // Mutation to edit a subject
  const [editSubject] = useMutation(EDIT_SUBJECT, {
    onCompleted: () => {
      onSuccess('Class updated successfully!')
      refetchSubjects()
    },
    onError: () => onError('Failed to update class'),
  })

  return {
    subjectsData,
    subjectsLoading,
    createSubject,
    deleteSubject,
    updateOrderSubjects,
    editSubject,
    refetchSubjects,
  }
}
