import { useCallback, useState } from 'react'

import { useMutation } from '@apollo/client'
import { Rating, Tooltip } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { Assignment, Maybe, Subject, User } from 'types/graphql'

import ConfirmationDialog from 'src/components/ConfirmationDialog/ConfirmationDialog'

import {
  UPDATE_GRADE,
  CREATE_GRADE,
  CREATE_STUDENT,
  CREATE_USER_SUBJECT,
  CREATE_NEW_ASSIGNMENT,
  UPDATE_ASSIGNMENT,
  DELETE_ASSIGNMENT,
} from './ClassPageQueries'

export const useGradeManagement = () => {
  const [updateGrade] = useMutation(UPDATE_GRADE)
  const [createGrade] = useMutation(CREATE_GRADE)

  const handleSubmitGrade = async (
    assignmentId: string,
    studentId: string,
    grade: string,
    gradeId?: string
  ) => {
    if (gradeId) {
      await updateGrade({
        variables: {
          id: gradeId,
          input: { grade: parseInt(grade) },
        },
      })
    } else {
      await createGrade({
        variables: {
          input: {
            date: new Date().toUTCString(),
            grade: parseInt(grade),
            assignmentId,
            userId: studentId,
          },
        },
      })
    }
  }

  return { handleSubmitGrade }
}

export const useStudentManagement = (
  subjectId: string,
  refetchSubject: () => void
) => {
  const [createStudent] = useMutation(CREATE_STUDENT)
  const [createSubjectStudent] = useMutation(CREATE_USER_SUBJECT)

  const handleSubmitNewStudent = async (values: {
    firstName: string
    lastName: string
  }) => {
    const input = {
      name: values.firstName,
      role: 'student',
      lastName: values.lastName,
    }

    try {
      const user = await createStudent({ variables: { input } })
      const input2 = {
        subjectId: subjectId,
        userId: user.data.createUser.id,
      }
      await createSubjectStudent({ variables: { input: input2 } })
      refetchSubject()
    } catch (error) {
      console.error('Error creating new student:', error)
    }
  }

  return { handleSubmitNewStudent }
}

export const useAssignmentManagement = (
  subjectId: string,
  refetchSubject: () => void
) => {
  const [createNewAssignment] = useMutation(CREATE_NEW_ASSIGNMENT)
  const [updateAssignment] = useMutation(UPDATE_ASSIGNMENT)
  const [deleteAssignment] = useMutation(DELETE_ASSIGNMENT)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(
    null
  )

  const handleSubmitCreateOrUpdateAssignment = async (
    values: {
      title: string
      date: dayjs.Dayjs
      description: string
    },
    assignmentId?: string
  ) => {
    const input = {
      title: values.title,
      subjectId: subjectId,
      date: values.date,
      description: values.description,
    }

    try {
      if (assignmentId) {
        await updateAssignment({ variables: { id: assignmentId, input } })
      } else {
        await createNewAssignment({ variables: { input } })
      }
      refetchSubject()
    } catch (error) {
      console.error('Error creating/updating assignment:', error)
    }
  }

  const handleDeleteAssignment = useCallback((assignmentId: string) => {
    setAssignmentToDelete(assignmentId)
    setConfirmDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (assignmentToDelete) {
      await deleteAssignment({ variables: { id: assignmentToDelete } })
      refetchSubject()
    }
    setConfirmDialogOpen(false)
    setAssignmentToDelete(null)
  }, [assignmentToDelete, deleteAssignment, refetchSubject])

  const cancelDelete = useCallback(() => {
    setConfirmDialogOpen(false)
    setAssignmentToDelete(null)
  }, [])

  const DeleteConfirmationDialog = useCallback(
    () => (
      <ConfirmationDialog
        open={confirmDialogOpen}
        title="Delete Assignment"
        content="Are you sure you want to delete this assignment? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    ),
    [confirmDialogOpen, confirmDelete, cancelDelete]
  )

  return {
    handleSubmitCreateOrUpdateAssignment,
    handleDeleteAssignment,
    DeleteConfirmationDialog,
  }
}

type AssignmentGrade = {
  grade: number | null
  gradeId: string | null
}

type StudentRowBase = {
  id: string
  name: string
  editable: boolean
}

type StudentRow = StudentRowBase & {
  [key: string]: AssignmentGrade | StudentRowBase[keyof StudentRowBase]
}

export const prepareRows = (subject: Subject) => {
  const rows: Maybe<StudentRowBase>[] = subject.students.map(
    (student: Maybe<User>) => {
      if (!student) {
        return null
      }
      const studentRow: StudentRow = {
        id: student.id,
        name: student.name + ' ' + student?.lastName,
        editable: true,
      }
      subject.assignments?.forEach((assignment: Maybe<Assignment>) => {
        const grade = assignment?.grades.find(
          (grade) => grade?.userId === student?.id
        )
        if (grade && assignment?.id) {
          studentRow[assignment.id] = {
            grade: grade.grade,
            gradeId: grade.id,
          }
        } else if (assignment?.id) {
          studentRow[assignment.id] = {
            grade: null,
            gradeId: null,
          }
        }
      })
      return studentRow
    }
  )
  return rows.filter((row): row is StudentRow => row !== null)
}

export const prepareColumns = (
  subject: Subject,
  handleSubmitGrade: (
    assignmentId: string,
    studentId: string,
    grade: string,
    viewMode: 'stars' | 'numbers',
    gradeId?: string
  ) => void,
  viewMode: 'stars' | 'numbers'
) => {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: false,
    },
  ]
  let restColumns: Maybe<GridColDef>[] = []
  if (subject.assignments) {
    restColumns = subject.assignments.map((assignment: Maybe<Assignment>) => {
      if (!assignment) {
        return null
      }
      return {
        id: assignment.id,
        field: assignment.id,
        headerName: assignment.title,
        width: 150,
        type: 'number',
        editable: true,
        gradeId: (params: GridRenderCellParams) => params.value.gradeId,
        renderCell: (params: GridRenderCellParams) => {
          if (viewMode === 'stars') {
            return (
              <Rating
                name="simple-controlled"
                size="small"
                value={6 - (params.value?.grade ?? 0)} // Reverse the star rating
                onChange={(event, value) => {
                  // Add null check
                  const assignmentId = params.field
                  const studentId = params.row.id // Assuming the studentId is stored in the 'id' field of the row
                  const grade: number | null = value ? 6 - value : null // Reverse the grade before saving
                  const gradeId = params.value.gradeId
                  if (grade) {
                    handleSubmitGrade(
                      assignmentId,
                      studentId,
                      grade.toString(),
                      gradeId,
                      viewMode
                    )
                    params.value.grade = grade
                    // Deselect row in MUI
                    params.api.selectRow(params.id, false, false)
                  }
                }}
              />
            )
          } else {
            return <span>{params.value?.grade}</span>
          }
        },
        renderHeader: () => (
          <Tooltip
            title={
              <>
                {' '}
                Title: {assignment.title}
                {<br />}
                {`Date: ${new Date(
                  assignment.date ?? assignment.createdAt
                ).toLocaleDateString()}`}
                {assignment.description && <br />} {assignment.description}
              </>
            }
          >
            <span>{assignment.title}</span>
          </Tooltip>
        ),
      }
    })
  }
  const restColumnsFiltered: GridColDef[] = restColumns.filter(
    (column): column is GridColDef => column !== null
  )
  restColumnsFiltered?.forEach((column) => {
    columns.push(column)
  })
  return columns
}
