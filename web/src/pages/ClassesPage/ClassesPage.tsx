import * as React from 'react'

import { Box, Button, Grid } from '@mui/material'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import { useMutation, useQuery } from '@redwoodjs/web'

import DraggableList from 'src/components/DraggableList/List'
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
const GET_SUBJECTS_FOR_TEACHER = gql`
  query GetSubjectsForTeacherQuery($teacherId: Int!) {
    subjectsByTeacherId(teacherId: $teacherId) {
      id
      teacherId
      subjectName
      subjectDescription
      order
      archived
    }
  }
`
const DELETE_SUBJECT = gql`
  mutation DeleteSubjectMutation($id: Int!) {
    deleteSubject(id: $id) {
      id
    }
  }
`
const UPDATE_SUBJECT = gql`
  mutation UpdateOrderSubjectMutation(
    $id: Int!
    $input: UpdateOrderSubjectInput!
  ) {
    updateOrderSubject(id: $id, input: $input) {
      id
      teacherId
      subjectName
      subjectDescription
      order
      archived
    }
  }
`
const createItemList = (data) => {
  if (!data || !data.subjectsByTeacherId) {
    return []
  }
  //order the list
  return data.subjectsByTeacherId
    .map((subject) => ({
      id: subject.id.toString(),
      primary: subject.subjectName,
      order: subject.order,
      archived: subject.archived,
    }))
    .sort((a, b) => a.order - b.order)
}

const ClassesPage = () => {
  const userData = React.useContext(UserContext)
  const { loading, data, refetch } = useQuery(GET_SUBJECTS_FOR_TEACHER, {
    variables: { teacherId: userData?.getUserByEmail.id },
  })
  const [itemList, setItemList] = React.useState([])
  React.useEffect(() => {
    if (data) {
      setItemList(createItemList(data))
    }
  }, [data])
  const [messageForSnackbar, setMessageForSnackbar] = React.useState('')
  const [addNewClass, setAddNewClass] = React.useState(false) // Initialize addNewClass with false
  const [open, setOpen] = React.useState(false)
  const [createSubject] = useMutation(CREATE_SUBJECT, {
    onCompleted: () => {
      setAddNewClass(false)
      setMessageForSnackbar('Class added successfully!')
      setOpen(true) // Open the Snackbard
      refetch()
    },
  })
  const [deleteSubject] = useMutation(DELETE_SUBJECT, {
    onCompleted: () => {
      setMessageForSnackbar('Class deleted successfully!')
      setOpen(true) // Close the Snackbar
      refetch()
    },
  })
  const [updateSubject] = useMutation(UPDATE_SUBJECT)
  const handleUpdateOrderSubjects = (data) => {
    for (let i = 0; i < data.length; i++) {
      updateSubject({
        variables: {
          id: parseInt(data[i].id),
          input: { order: data[i].order },
        },
      })
    }
  }
  const handleDelete = (id) => {
    const idNumber = parseInt(id)
    deleteSubject({ variables: { id: idNumber } })
    const remainingItems = itemList.filter((item) => item.id !== idNumber)
    setItemList(remainingItems)
  }
  if (!userData) {
    return <div>Loading...</div>
  }
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
            {messageForSnackbar}
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
        <Box display="flex" justifyContent="center" alignItems="center">
          <br />
          <br />
          {loading && <div>Loading...</div>}
          <DraggableList
            items={itemList}
            handleDelete={handleDelete}
            handleUpdateOrderSubjects={handleUpdateOrderSubjects}
          />
        </Box>
      </Grid>
    </>
  )
}

export default ClassesPage
