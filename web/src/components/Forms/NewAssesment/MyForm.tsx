import * as React from 'react'

import { Box, Button, Grid } from '@mui/material'
import { Form, Formik, Field } from 'formik'

import { MyField } from './MyField'

interface Values {
  category: string
}

interface Props {
  onSubmit: (values: Values) => void
}

export const MyForm: React.FC<Props> = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ category: '' }}
      onSubmit={(values) => {
        onSubmit(values)
      }}
    >
      {({ values }) => (
        <Grid container justifyContent="center">
          <Form>
            <Box width="100%" paddingBottom="20px">
              <Field placeholder="Title" name="title" component={MyField} />
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
