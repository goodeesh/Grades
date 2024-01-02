import * as React from 'react'

import { TextField } from '@mui/material'
import { TextFieldProps } from '@mui/material/TextField'
import { FieldProps } from 'formik'

export const MyField: React.FC<FieldProps & TextFieldProps> = ({
  placeholder,
  field,
}) => {
  if (field.name === 'description') {
    return (
      <TextField
        sx={{ width: '50%' }}
        multiline
        rows={4}
        placeholder={placeholder}
        {...field}
      />
    )
  }
  return (
    <TextField sx={{ width: '50%' }} placeholder={placeholder} {...field} />
  )
}
