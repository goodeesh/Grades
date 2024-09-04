import { useState, useCallback } from 'react'

import { Subject } from 'types/graphql'

import { useParams } from '@redwoodjs/router'
import { Metadata, useQuery } from '@redwoodjs/web'

import CustomDataGrid from 'src/components/DataGrid/DataGrid'
import { NewAssignmentDialog } from 'src/components/Forms/NewAssignment/NewAssignmentDialog'
import { NewStudentDialog } from 'src/components/Forms/NewStudent/NewStudentDialog'

import {
  useGradeManagement,
  useStudentManagement,
  useAssignmentManagement,
  prepareColumns,
  prepareRows,
} from './ClassPageHelper'
import { GET_SUBJECT_BY_ID } from './ClassPageQueries'

interface DialogState {
  student: boolean
  assignment: boolean
  assignmentId: string | null
}

const ClassPage = () => {
  const { id } = useParams()
  const { data, loading, refetch } = useQuery(GET_SUBJECT_BY_ID, {
    variables: { id },
  })
  const [viewMode, setViewMode] = useState<'stars' | 'numbers'>('stars')
  const [tableKey, setTableKey] = useState(0)

  const handleChangeViewMode = useCallback(
    (newMode: 'stars' | 'numbers') => {
      setViewMode(newMode)
      setTableKey((prevKey) => prevKey + 1)
      refetch()
    },
    [refetch]
  )

  const { handleSubmitGrade } = useGradeManagement()
  const { handleSubmitNewStudent } = useStudentManagement(id, refetch)
  const {
    handleSubmitCreateOrUpdateAssignment,
    handleDeleteAssignment,
    DeleteConfirmationDialog,
  } = useAssignmentManagement(id, refetch)

  const [dialogState, setDialogState] = React.useState<DialogState>({
    student: false,
    assignment: false,
    assignmentId: null,
  })

  const openStudentDialog = () =>
    setDialogState((prev) => ({ ...prev, student: true }))
  const openAssignmentDialog = (id: string | null = null) =>
    setDialogState({
      student: false,
      assignment: true,
      assignmentId: id,
    })

  const closeStudentDialog = () =>
    setDialogState((prev) => ({ ...prev, student: false }))
  const closeAssignmentDialog = () =>
    setDialogState((prev) => ({ ...prev, assignment: false }))

  if (loading) {
    return <div>Loading...</div>
  } else if (!data) {
    return <div>Class was not found</div>
  }

  const subject: Subject = data.subject

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Metadata title="Class" description="Class page" />
      <NewStudentDialog
        open={dialogState.student}
        onClose={closeStudentDialog}
        onSubmit={(values) => {
          handleSubmitNewStudent(values).then(closeStudentDialog)
        }}
      />
      <DeleteConfirmationDialog />
      <NewAssignmentDialog
        open={dialogState.assignment}
        onClose={closeAssignmentDialog}
        onSubmit={(values) => {
          handleSubmitCreateOrUpdateAssignment(
            values,
            dialogState.assignmentId ?? undefined
          ).then(closeAssignmentDialog)
        }}
        assignment={
          subject.assignments?.find(
            (a) => a?.id === dialogState.assignmentId
          ) ?? null
        }
      />
      <CustomDataGrid
        key={tableKey}
        columns={prepareColumns(subject, handleSubmitGrade, viewMode)}
        rows={prepareRows(subject)}
        setOpenNewStudentDialog={openStudentDialog}
        setOpenCreateAssessmentDialog={openAssignmentDialog}
        handleSubmitGrade={handleSubmitGrade}
        refetch={refetch}
        handleDeleteAssignment={handleDeleteAssignment}
        viewMode={viewMode}
        changeViewMode={handleChangeViewMode} // Make sure this prop name is correct
      />
    </>
  )
}

export default ClassPage
