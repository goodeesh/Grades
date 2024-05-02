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
import { GetSubjectsForTeacherQuery } from 'types/graphql'

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

const UPDATE_ORDER_SUBJECTS = gql`
  mutation UpdateOrderSubjectsMutation($input: UpdateOrderSubjectsInput!) {
    updateOrderSubjects(input: $input) {
      id
      order
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
type SubjectItem = {
  id: string
  primary: string
  secondary: string
  order: number
  archived: boolean
}

const createItemList = (data: GetSubjectsForTeacherQuery): SubjectItem[] => {
  if (!data || !data.subjectsByTeacherId) {
    return []
  }
  return data.subjectsByTeacherId
    .map((subject: GetSubjectsForTeacherQuery['subjectsByTeacherId'][0]) => ({
      id: subject.id.toString(),
      primary: subject.subjectName,
      secondary: subject.subjectDescription,
      order: subject.order ?? 0,
      archived: subject.archived,
    }))
    .sort((a, b) => a.order - b.order)
}

type TypeState = {
  id: string
  itemList: SubjectItem[]
  open: boolean
  messageForSnackbar: string
  addNewClass: boolean
}

const initialState: TypeState = {
  id: '',
  itemList: [],
  open: false,
  messageForSnackbar: '',
  addNewClass: false,
}
type TypeAction =
  | { type: 'SET_ID'; payload: string }
  | { type: 'SET_ITEM_LIST'; payload: GetSubjectsForTeacherQuery }
  | {
      type: 'TOGGLE_SNACKBAR'
      payload: { open: boolean; message: string }
    }
  | { type: 'TOGGLE_ADD_NEW_CLASS' }
  | { type: 'TOGGLE_OPEN' }
function reducer(state: TypeState, action: TypeAction) {
  switch (action.type) {
    case 'SET_ID':
      return { ...state, id: action.payload }
    case 'SET_ITEM_LIST':
      return { ...state, itemList: createItemList(action.payload) }
    case 'TOGGLE_SNACKBAR':
      return {
        ...state,
        message: action.payload.message,
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
      setState({ type: 'SET_ID', payload: userData.id })
    }
  }, [userData])
  const { data, loading, refetch } = useQuery<GetSubjectsForTeacherQuery>(
    GET_SUBJECTS_FOR_TEACHER,
    {
      variables: { teacherId: state.id },
    }
  )
  React.useEffect(() => {
    if (data) {
      setState({ type: 'SET_ITEM_LIST', payload: data })
    }
  }, [data])
  const handleSnackbar = (message: string) => {
    setState({
      type: 'TOGGLE_SNACKBAR',
      payload: { open: true, message: message },
    })
  }

  const [updateOrderSubjects] = useMutation(UPDATE_ORDER_SUBJECTS)

  const [createSubject] = useMutation(CREATE_SUBJECT, {
    onCompleted: () => {
      refetch().catch((error) => console.error(error))
      setState({ type: 'TOGGLE_ADD_NEW_CLASS' }) // Close the form
      handleSnackbar('Class created successfully!')
      setState({ type: 'TOGGLE_OPEN' }) // Close the Snackbar
    },
  })
  const [deleteSubject] = useMutation(DELETE_SUBJECT, {
    onCompleted: () => {
      refetch().catch((error) => console.error(error))
      handleSnackbar('Class deleted successfully!')
      setState({ type: 'TOGGLE_OPEN' }) // Close the Snackbar
    },
  })
  const [updateNameDescription] = useMutation(UPDATE_NAME_DESCRIPTION)
  const handleUpdateNameDescription = (
    id: string,
    input: {
      name: string
      description: string
    }
  ) => {
    updateNameDescription({
      variables: {
        id: id,
        input: {
          subjectName: input.name,
          subjectDescription: input.description,
        },
      },
    }).catch((error) => console.error(error))
  }
  const handleOpen = (id: string) => {
    //navigate to the class page
    navigate(routes.manageClass({ id: id }))
  }

  const handleUpdateOrderSubjects = (newOrderedItems: SubjectItem[]) => {
    const ids = newOrderedItems.map((item) => item.id)
    const order = newOrderedItems.map((item) => item.order)

    updateOrderSubjects({
      variables: {
        input: {
          ids: ids,
          order: order,
        },
      },
    }).catch((error) => console.error(error))
  }

  const handleDelete = (id: string) => {
    deleteSubject({ variables: { id: id } }).catch((error) =>
      console.error(error)
    )
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
                        teacherId: userData.id,
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
