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

import ConfirmationDialog from 'src/components/ConfirmationDialog/ConfirmationDialog'
import DraggableList, {
  Item as DraggableItem,
} from 'src/components/DraggableList/List'
import { MyForm } from 'src/components/Forms/NewClass/MyForm'
import { UserContext } from 'src/components/PersistentDrawerLeft'

import {
  GET_SUBJECTS_FOR_TEACHER,
  UPDATE_ORDER_SUBJECTS,
  CREATE_SUBJECT,
  DELETE_SUBJECT,
  EDIT_SUBJECT,
} from './ClassPageQueries'

type SubjectItem = DraggableItem

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
  severity: 'success' | 'error'
  addNewClass: boolean
}

const initialState: TypeState = {
  id: '',
  itemList: [],
  open: false,
  messageForSnackbar: '',
  severity: 'success',
  addNewClass: false,
}
type TypeAction =
  | { type: 'SET_ID'; payload: string }
  | { type: 'SET_ITEM_LIST'; payload: GetSubjectsForTeacherQuery }
  | {
      type: 'TOGGLE_SNACKBAR'
      payload: { open: boolean; message: string; severity: 'success' | 'error' }
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
        open: action.payload.open,
        messageForSnackbar: action.payload.message,
        severity: action.payload.severity,
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
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [classToDelete, setClassToDelete] = React.useState<string | null>(null)

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
  const handleSnackbar = (
    message: string,
    severity: 'success' | 'error' = 'success'
  ) => {
    setState({
      type: 'TOGGLE_SNACKBAR',
      payload: { open: true, message, severity },
    })
  }

  const [updateOrderSubjects] = useMutation(UPDATE_ORDER_SUBJECTS, {
    onCompleted: () => {
      handleSnackbar('Class order updated successfully!')
    },
    onError: (error) => {
      handleSnackbar('Failed to update class order. Please try again.', 'error')
      console.error(error)
    },
  })

  const [createSubject] = useMutation(CREATE_SUBJECT, {
    onCompleted: () => {
      refetch().catch((error) => console.error(error))
      setState({ type: 'TOGGLE_ADD_NEW_CLASS' }) // Close the form
      handleSnackbar('New class created successfully!')
    },
    onError: (error) => {
      handleSnackbar('Failed to create new class. Please try again.', 'error')
      console.error(error)
    },
  })

  const [deleteSubject] = useMutation(DELETE_SUBJECT, {
    onCompleted: () => {
      refetch().catch((error) => console.error(error))
      handleSnackbar('Class deleted successfully!')
    },
    onError: (error) => {
      handleSnackbar('Failed to delete class. Please try again.', 'error')
      console.error(error)
    },
  })

  const [updateNameDescription] = useMutation(EDIT_SUBJECT, {
    onCompleted: () => {
      refetch().catch((error) => console.error(error))
      handleSnackbar('Class updated successfully!')
    },
    onError: (error) => {
      handleSnackbar('Failed to update class. Please try again.', 'error')
      console.error(error)
    },
  })

  const handleUpdateNameDescription = (
    id: string,
    input: {
      name: string
      description: string | null
    }
  ) => {
    updateNameDescription({
      variables: {
        id: id,
        input: {
          subjectName: input.name,
          subjectDescription: input.description || '', // Convert null to empty string
        },
      },
    }).catch((error) => console.error(error))
  }

  const handleOpen = (id: string) => {
    //navigate to the class page
    navigate(routes.manageClass({ id: id }))
  }

  const handleUpdateOrderSubjects = (newOrderedItems: DraggableItem[]) => {
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
    setClassToDelete(id)
    setConfirmDialogOpen(true)
  }

  const confirmDelete = () => {
    if (classToDelete) {
      deleteSubject({ variables: { id: classToDelete } }).catch((error) =>
        console.error(error)
      )
    }
    setConfirmDialogOpen(false)
    setClassToDelete(null)
  }

  const cancelDelete = () => {
    setConfirmDialogOpen(false)
    setClassToDelete(null)
  }

  if (!userData) {
    return <div>Loading...</div>
  }
  if (loading) {
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
            severity={state.severity}
            sx={{ width: '100%' }}
          >
            {state.messageForSnackbar}
          </Alert>
        </Snackbar>
        <ConfirmationDialog
          open={confirmDialogOpen}
          title="Delete Class"
          content="Are you sure you want to delete this class? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
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
