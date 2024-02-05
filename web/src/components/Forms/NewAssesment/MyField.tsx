import * as React from 'react'

import { TextField } from '@mui/material'
import { TextFieldProps } from '@mui/material/TextField'
import { FieldProps } from 'formik'

export const MyField: React.FC<FieldProps & TextFieldProps> = ({
  placeholder,
  field,
}) => {
  if (field.name === 'description' || field.name === 'secondary') {
    return (
      <TextField
        sx={{ width: '100%' }}
        multiline
        rows={4}
        placeholder={placeholder}
        {...field}
      />
    )
  }
  return (
    <TextField sx={{ width: '100%' }} placeholder={placeholder} {...field} />
  )
}
