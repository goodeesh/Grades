import React from 'react'

import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { GridCloseIcon } from '@mui/x-data-grid'

import { MyForm } from './MyForm'

interface NewStudentDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: { firstName: string; lastName: string }) => void
}

export const NewStudentDialog: React.FC<NewStudentDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New student</DialogTitle>
      <IconButton
        style={{ position: 'absolute', right: '8px', top: '8px' }}
        onClick={onClose}
      >
        <GridCloseIcon />
      </IconButton>
      <DialogContent>
        <MyForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
