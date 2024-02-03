import * as React from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { GridCloseIcon } from '@mui/x-data-grid'

import { navigate, routes } from '@redwoodjs/router'
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
  query GetSubjectsForTeacherQuery($teacherId: String!) {
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
  mutation DeleteSubjectMutation($id: String!) {
    deleteSubject(id: $id) {
      id
    }
  }
`
const UPDATE_SUBJECT = gql`
  mutation UpdateOrderSubjectMutation(
    $id: String!
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
const UPDATE_NAME_DESCRIPTION = gql`
  mutation updateNameDescription(
    $id: String!
    $input: UpdateNameDescriptionInput!
  ) {
    updateNameDescription(id: $id, input: $input) {
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
      secondary: subject.subjectDescription,
      order: subject.order,
      archived: subject.archived,
    }))
    .sort((a, b) => a.order - b.order)
}
const initialState = {
  id: '',
  itemList: [],
  open: false,
  messageForSnackbar: '',
  addNewClass: false,
}
function reducer(state, action) {
  switch (action.type) {
    case 'SET_ID':
      return { ...state, id: action.payload }
    case 'SET_ITEM_LIST':
      return { ...state, itemList: createItemList(action.payload) }
    case 'TOGGLE_SNACKBAR':
      return {
        ...state,
        messageForSnackbar: action.payload.message,
      }
    case 'TOGGLE_ADD_NEW_CLASS':
      return { ...state, addNewClass: !state.addNewClass }
    case 'TOGGLE_OPEN':
      return { ...state, open: !state.open }
    default:
      throw new Error()
  }
}
const ClassesPage = () => {
  const [state, setState] = React.useReducer(reducer, initialState)
  const userData = React.useContext(UserContext)
  //set id in state
  React.useEffect(() => {
    if (userData) {
      setState({ type: 'SET_ID', payload: userData.getUserByEmail.id })
    }
  }, [userData])
  const { data, loading, refetch } = useQuery(GET_SUBJECTS_FOR_TEACHER, {
    variables: { teacherId: state.id },
  })
  React.useEffect(() => {
    if (data) {
      setState({ type: 'SET_ITEM_LIST', payload: data })
    }
  }, [data])
  const handleSnackbar = (message) => {
    setState({
      type: 'TOGGLE_SNACKBAR',
      payload: { open: true, message: message },
    })
  }
  //const [addNewClass, setAddNewClass] = React.useState(false) // Initialize addNewClass with false
  //const [open, setOpen] = React.useState(false)
  const [createSubject] = useMutation(CREATE_SUBJECT, {
    onCompleted: () => {
      refetch()
      setState({ type: 'TOGGLE_ADD_NEW_CLASS' }) // Close the form
      handleSnackbar('Class created successfully!')
      setState({ type: 'TOGGLE_OPEN' }) // Close the Snackbar
    },
  })
  const [deleteSubject] = useMutation(DELETE_SUBJECT, {
    onCompleted: () => {
      refetch()
      handleSnackbar('Class deleted successfully!')
      setState({ type: 'TOGGLE_OPEN' }) // Close the Snackbar
    },
  })
  const [updateSubject] = useMutation(UPDATE_SUBJECT)
  const [updateNameDescription] = useMutation(UPDATE_NAME_DESCRIPTION)
  const handleUpdateNameDescription = (id, input) => {
    updateNameDescription({
      variables: {
        id: id,
        input: {
          subjectName: input.name,
          subjectDescription: input.description,
        },
      },
    })
  }
  const handleOpen = (id) => {
    //navigate to the class page
    navigate(routes.manageClass({ id: id }))
  }

  const handleUpdateOrderSubjects = (data) => {
    for (let i = 0; i < data.length; i++) {
      const currentItem = state.itemList.find((item) => item.id === data[i].id)
      if (currentItem.order !== data[i].order) {
        updateSubject({
          variables: {
            id: data[i].id,
            input: { order: data[i].order },
          },
        })
      }
    }
  }
  const handleDelete = (id) => {
    deleteSubject({ variables: { id: id } })
  }
  if (!userData) {
    return <div>Loading...</div>
  }
  return (
    <>
      <Grid component="main" maxWidth="xs" textAlign="center" margin="auto">
        <Snackbar
          open={state.open}
          autoHideDuration={3000}
          onClose={() => setState({ type: 'TOGGLE_OPEN' })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setState({ type: 'TOGGLE_OPEN' })}
            severity="success"
            sx={{ width: '100%' }}
          >
            {state.messageForSnackbar}
          </Alert>
        </Snackbar>
        {/* <Button
          variant="contained"
          onClick={() => setState({ type: 'TOGGLE_ADD_NEW_CLASS' })}
        >
          Add a new Class
        </Button>{' '}
        <br />
        <Box textAlign="center" margin="auto">
          <br />
          {state.addNewClass && ( // Render DemoPaper if addNewClass is true
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
        </Box> */}
        <Box textAlign="center" margin="auto">
          <br />
          <Button
            variant="contained"
            onClick={() => setState({ type: 'TOGGLE_ADD_NEW_CLASS' })}
          >
            Add a new Class
          </Button>

          <Dialog
            open={state.addNewClass}
            onClose={() => setState({ type: 'TOGGLE_ADD_NEW_CLASS' })}
          >
            <DialogTitle>Add a new Class</DialogTitle>
            <IconButton
              style={{ position: 'absolute', right: '8px', top: '8px' }}
              onClick={() => setState({ type: 'TOGGLE_ADD_NEW_CLASS' })}
            >
              <GridCloseIcon />
            </IconButton>
            <DialogContent>
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
            </DialogContent>
          </Dialog>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <br />
          <br />
          {loading && <div>Loading...</div>}
          <DraggableList
            items={state.itemList}
            handleDelete={handleDelete}
            handleUpdateOrderSubjects={handleUpdateOrderSubjects}
            handleNameDescription={handleUpdateNameDescription}
            handleOpen={handleOpen}
          />
        </Box>
      </Grid>
    </>
  )
}

export default ClassesPage
