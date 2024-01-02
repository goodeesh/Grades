import * as React from 'react'

import { Box, Button, Grid } from '@mui/material'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import { useMutation } from '@redwoodjs/web'

import { MyForm } from 'src/components/Forms/NewClass/MyForm'
import { UserContext } from 'src/components/PersistentDrawerLeft'

const CREATE_SUBJECT = gql`
  mutation CreateSubjectMutation($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      teacherId
      subjectName
      subjectDescription
    }
  }
`

const ClassesPage = () => {
  const userData = React.useContext(UserContext)
  const [addNewClass, setAddNewClass] = React.useState(false) // Initialize addNewClass with false
  const [open, setOpen] = React.useState(false)
  const [createSubject] = useMutation(CREATE_SUBJECT, {
    onCompleted: () => {
      setAddNewClass(false) // Set addNewClass to false when the mutation is completed
      setOpen(true) // Open the Snackbar
    },
  })
  return (
    <>
      <Grid component="main" maxWidth="xs" textAlign="center" margin="auto">
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            The class was successfully added!
          </Alert>
        </Snackbar>
        <Button
          variant="contained"
          onClick={() => setAddNewClass(!addNewClass)}
        >
          Add a new Class
        </Button>{' '}
        {/* Set addNewClass to true when the button is clicked */}
        <br />
        <Box textAlign="center" margin="auto">
          <br />
          {addNewClass && ( // Render DemoPaper if addNewClass is true
            <MyForm
              onSubmit={(values) =>
                createSubject({
                  variables: {
                    input: {
                      teacherId: userData.getUserByEmail.id,
                      subjectName: values.className,
                      subjectDescription: values.description,
                    },
                  },
                })
              }
            />
          )}
        </Box>
      </Grid>
    </>
  )
}

export default ClassesPage
