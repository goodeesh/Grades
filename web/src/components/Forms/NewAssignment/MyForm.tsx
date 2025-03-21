import * as React from 'react'

import { Box, Button, Grid } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { Form, Formik, Field } from 'formik'
import { Assignment } from 'types/graphql'

import { MyField } from './MyField'

interface Values {
  title: string
  date: dayjs.Dayjs
  description: string
}

interface Props {
  onSubmit: (values: Values) => void
  assignment: Assignment | null
}

export const MyForm: React.FC<Props> = ({ onSubmit, assignment }) => {
  return (
    <Formik
      initialValues={{
        title: assignment?.title || '',
        date: assignment?.date ? dayjs(assignment.date) : dayjs(),
        description: assignment?.description || '',
      }}
      onSubmit={(values: Values) => {
        onSubmit(values)
      }}
    >
      {({ setFieldValue, values }) => (
        <Grid container justifyContent="center">
          <Form>
            <Box width="100%" paddingBottom="20px">
              <Field placeholder="Title*" name="title" component={MyField} />
            </Box>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    value={values.date}
                    onChange={(value) => {
                      setFieldValue('date', value)
                    }}
                    label="Date"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <Box width="100%" paddingTop="20px">
              <Field
                as="textarea"
                name="description"
                placeholder="description"
                component={MyField}
              />
            </Box>

            <Box width="100%" paddingTop="20px">
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
