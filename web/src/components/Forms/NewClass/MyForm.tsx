import * as React from 'react'

import { Button } from '@mui/material'
import { Form, Formik, Field } from 'formik'

import { MyField } from './MyField'

interface Values {
  className: string
  description: string
  email: string
}

interface Props {
  onSubmit: (values: Values) => void
}

export const MyForm: React.FC<Props> = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ className: '', description: '', email: '' }}
      onSubmit={(values) => {
        onSubmit(values)
      }}
    >
      {({ values }) => (
        <Form>
          <div>
            <Field
              name="className"
              placeholder="class name"
              component={MyField}
            />
          </div>
          <br />
          <div>
            <Field
              name="description"
              placeholder="description"
              component={MyField}
            />
          </div>
          <br />

          <Button variant="contained" type="submit">
            submit
          </Button>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </Form>
      )}
    </Formik>
  )
}
