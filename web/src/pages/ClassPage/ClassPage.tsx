import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material'
import { GridCloseIcon } from '@mui/x-data-grid'

import { useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import CustomDataGrid from 'src/components/DataGrid/DataGrid'
import { MyForm } from 'src/components/Forms/NewStudent/MyForm'

// Sample columns data
// Sample columns data
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  // Participation columns
  {
    field: 'participation1',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation2',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation3',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation4',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation5',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation6',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation7',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation8',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation9',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation10',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation11',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation12',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation13',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation14',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'participation15',
    headerName: 'Participation',
    type: 'number',
    width: 120,
    editable: true,
  },
  // Add more columns as needed
  // Exams
  {
    field: 'exam1',
    headerName: 'Exam',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'exam2',
    headerName: 'Exam',
    type: 'number',
    width: 100,
    editable: true,
  },
  // Vocabulary evaluations
  {
    field: 'vocab1',
    headerName: 'Vocabulary',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'vocab2',
    headerName: 'Vocabulary',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'vocab3',
    headerName: 'Vocabulary',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'vocab4',
    headerName: 'Vocabulary',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'vocab5',
    headerName: 'Vocabulary',
    type: 'number',
    width: 100,
    editable: true,
  },
  // Add more vocabulary evaluations as needed
]

// Sample rows data (at least 25 students)
const rows = []
for (let i = 1; i <= 25; i++) {
  rows.push({
    id: i,
    lastName: `Student${i}`,
    firstName: `First${i}`,
    age: Math.floor(Math.random() * 10) + 18, // Random age between 18 and 27
    participation1: Math.floor(Math.random() * 5) + 1, // Random participation score between 1 and 5
    participation2: Math.floor(Math.random() * 5) + 1,
    // Add values for the rest of the participation columns, exams, and vocabulary evaluations
    exam1: Math.floor(Math.random() * 100) + 1, // Random exam score between 1 and 100
    exam2: Math.floor(Math.random() * 100) + 1,
    vocab1: Math.floor(Math.random() * 5) + 1, // Random vocabulary evaluation score between 1 and 5
    vocab2: Math.floor(Math.random() * 5) + 1,
    vocab3: Math.floor(Math.random() * 5) + 1,
    vocab4: Math.floor(Math.random() * 5) + 1,
    vocab5: Math.floor(Math.random() * 5) + 1,
    // Add values for the rest of the vocabulary evaluations
  })
}

const ClassPage = () => {
  const [openStudent, setOpenStudent] = React.useState(false)
  const { id } = useParams()
  console.log('the id is ', id)
  const handleSetOpenStudent = () => {
    setOpenStudent(!openStudent)
  }

  return (
    <>
      <Grid
        item
        sx={{
          width: '100%', // Full width
          textAlign: 'center',
          margin: 'auto',
          overflow: 'scroll',
        }}
      >
        <Box textAlign="center" margin="auto">
          <br />

          <Dialog open={openStudent} onClose={() => setOpenStudent(false)}>
            <DialogTitle>Add new student</DialogTitle>
            <IconButton
              style={{ position: 'absolute', right: '8px', top: '8px' }}
              onClick={() => setOpenStudent(false)}
            >
              <GridCloseIcon />
            </IconButton>
            <DialogContent>
              <MyForm onSubmit={(values) => console.log('values', values)} />
            </DialogContent>
          </Dialog>
        </Box>
        <Metadata title="Class" description="Class page" />
        <CustomDataGrid
          columns={columns}
          rows={rows}
          setOpenNewStudentDialog={handleSetOpenStudent}
        />
      </Grid>
    </>
  )
}

export default ClassPage
