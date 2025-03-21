import * as React from 'react'

import { Box, Button, Grid } from '@mui/material'
import { Form, Formik, Field } from 'formik'

import { MyField } from './MyField'

interface Values {
  firstName: string
  lastName: string
}

interface Props {
  onSubmit: (values: Values) => void
}

export const MyForm: React.FC<Props> = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ firstName: '', lastName: '' }}
      onSubmit={(values) => {
        onSubmit(values)
      }}
    >
      {() => (
        <Grid container justifyContent="center">
          <Form>
            <Box width="100%" paddingBottom="20px">
              <Field
                placeholder="first name"
                name="firstName"
                component={MyField}
              />
            </Box>
            <Box width="100%" paddingBottom="20px">
              <Field
                name="lastName"
                placeholder="last name"
                component={MyField}
              />
            </Box>
            <Box width="100%" paddingBottom="20px">
              <Button variant="contained" type="submit">
                submit
              </Button>
            </Box>
          </Form>
        </Grid>
      )}
    </Formik>
  )
}
