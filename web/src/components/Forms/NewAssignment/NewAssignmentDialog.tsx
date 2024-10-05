import React from 'react'

import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { GridCloseIcon } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { Assignment, AssignmentType } from 'types/graphql'

import { MyForm as MyFormCreateAssignment } from './MyForm'

interface NewAssignmentDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (
    values: {
      title: string
      date: dayjs.Dayjs
      description: string
      type: AssignmentType
    },
    assignmentId: string
  ) => void
  assignment: Assignment | null
}

export const NewAssignmentDialog: React.FC<NewAssignmentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  assignment,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New assignment</DialogTitle>
      <IconButton
        style={{ position: 'absolute', right: '8px', top: '8px' }}
        onClick={onClose}
      >
        <GridCloseIcon />
      </IconButton>
      <DialogContent>
        <MyFormCreateAssignment
          onSubmit={(values) => {
            console.log('values', values)
            onSubmit(values, assignment?.id ?? '')
          }}
          assignment={assignment}
        />
      </DialogContent>
    </Dialog>
  )
}
