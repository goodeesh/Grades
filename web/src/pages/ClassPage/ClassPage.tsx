import { useMutation } from '@apollo/client'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material'
import { GridCloseIcon, GridColDef } from '@mui/x-data-grid'
import { Assignment, Subject, User } from 'types/graphql'

import { useParams } from '@redwoodjs/router'
import { Metadata, useQuery } from '@redwoodjs/web'

import CustomDataGrid from 'src/components/DataGrid/DataGrid'
import { MyForm as MyFormCreateAssesment } from 'src/components/Forms/NewAssesment/MyForm'
import { MyForm as MyFormNewStudent } from 'src/components/Forms/NewStudent/MyForm'

// Sample columns data
// Sample columns data

const GET_SUBJECT_BY_ID = gql`
  query Subject($id: String!) {
    subject(id: $id) {
      id
      teacher {
        id
        name
      }
      students {
        id
        name
        lastName
      }
      assignments {
        id
        title
        description
        createdAt
        date
        grades {
          id
          userId
          grade
          date
        }
      }
    }
  }
`
const CREATE_STUDENT = gql`
  mutation CreateStudent($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
    }
  }
`
const CREATE_USER_SUBJECT = gql`
  mutation createSubjectStudents($input: CreateSubjectStudentsInput!) {
    createSubjectStudents(input: $input) {
      subjectId
      userId
    }
  }
`

const CREATE_NEW_ASSESMENT = gql`
  mutation CreateNewAssesment($input: CreateAssignmentInput!) {
    createAssignment(input: $input) {
      id
      title
    }
  }
`

const CREATE_GRADE = gql`
  mutation CreateGrade($input: CreateGradeInput!) {
    createGrade(input: $input) {
      id
      grade
    }
  }
`
const UPDATE_GRADE = gql`
  mutation UpdateGrade($id: String!, $input: UpdateGradeInput!) {
    updateGrade(id: $id, input: $input) {
      id
      grade
    }
  }
`

const prepareColumns = (subject: Subject) => {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: false,
    },

    ...subject.assignments.map((assignment: Assignment) => {
      return {
        id: assignment.id,
        field: assignment.id,
        headerName: assignment.title,
        type: 'number',
        editable: true,
        gradeId: (params) => params.value.gradeId,
        renderCell: (params) => (params.value.grade ? params.value.grade : ''),
        renderHeader: () => (
          <Tooltip
            title={
              <>
                {' '}
                Title: {assignment.title}
                {<br />}
                {`Date: ${new Date(
                  assignment.date ?? assignment.createdAt
                ).toLocaleDateString()}`}
                {assignment.description && <br />} {assignment.description}
              </>
            }
          >
            <span>{assignment.title}</span>
          </Tooltip>
        ),
      }
    }),
  ]
  return columns
}

const prepareRows = (subject: Subject) => {
  const rows = subject.students.map((student: User) => {
    const studentRow = {
      id: student.id,
      name: student.name + ' ' + student.lastName,
      editable: true,
    }
    subject.assignments.forEach((assignment: Assignment) => {
      const grade = assignment.grades.find(
        (grade) => grade.userId === student.id
      )
      if (grade) {
        studentRow[assignment.id] = {
          grade: grade.grade,
          gradeId: grade.id,
        }
      } else {
        studentRow[assignment.id] = {
          grade: null,
          gradeId: null,
        }
      }
    })
    return studentRow
  })
  return rows
}

const ClassPage = () => {
  const { id } = useParams()
  const { data, loading, refetch } = useQuery(GET_SUBJECT_BY_ID, {
    variables: { id },
  })
  const [updateGrade] = useMutation(UPDATE_GRADE)
  const [createGrade] = useMutation(CREATE_GRADE)
  const [createStudent] = useMutation(CREATE_STUDENT)
  const [createAssesment] = useMutation(CREATE_NEW_ASSESMENT)
  const [createSubjectStudent] = useMutation(CREATE_USER_SUBJECT)

  const handleSubmitGrade = async (
    assignmentId: string,
    studentId: string,
    grade: string,
    gradeId?: string
  ) => {
    if (gradeId) {
      const input = {
        grade: parseInt(grade),
      }
      updateGrade({ variables: { id: gradeId, input: input } })
    } else {
      const input = {
        date: new Date().toUTCString(),
        grade: parseInt(grade),
        assignmentId: assignmentId,
        userId: studentId,
      }
      await createGrade({ variables: { input: input } })
    }
    refetch()
  }

  const handleSubmitNewStudent = async (values) => {
    const input = {
      name: values.firstName,
      role: 'student',
      lastName: values.lastName,
    }

    const user = await createStudent({ variables: { input } })
    const input2 = {
      subjectId: id,
      userId: user.data.createUser.id, // Access the id property from the resolved value
    }
    await createSubjectStudent({ variables: { input: input2 } })
    setOpenStudent(false)
    refetch()
  }

  const handleSubmitCreateAssesment = async (values) => {
    console.log(values)
    const input = {
      title: values.title,
      subjectId: id,
      date: values.date,
      description: values.description,
    }
    await createAssesment({ variables: { input: input } })
    setOpenAssesment(false)
    refetch()
  }
  const handleSetOpenStudent = () => {
    setOpenStudent(!openStudent)
  }
  const handleSetOpenAssesment = () => {
    setOpenAssesment(!openAssesment)
  }
  const [openStudent, setOpenStudent] = React.useState(false)
  const [openAssesment, setOpenAssesment] = React.useState(false)
  if (loading) {
    return <div>Loading...</div>
  }

  const subject: Subject = data.subject
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
        <Grid item textAlign="center" margin="auto">
          <Dialog open={openStudent} onClose={() => setOpenStudent(false)}>
            <DialogTitle>New student</DialogTitle>
            <IconButton
              style={{ position: 'absolute', right: '8px', top: '8px' }}
              onClick={() => setOpenStudent(false)}
            >
              <GridCloseIcon />
            </IconButton>
            <DialogContent>
              <MyFormNewStudent
                onSubmit={(values) => handleSubmitNewStudent(values)}
              />
            </DialogContent>
          </Dialog>
        </Grid>
        <Grid item textAlign="center" margin="auto">
          <br />
          <Dialog open={openAssesment} onClose={() => setOpenAssesment(false)}>
            <DialogTitle>New assesment</DialogTitle>
            <IconButton
              style={{ position: 'absolute', right: '8px', top: '8px' }}
              onClick={() => setOpenAssesment(false)}
            >
              <GridCloseIcon />
            </IconButton>
            <DialogContent>
              <MyFormCreateAssesment
                onSubmit={(values) => handleSubmitCreateAssesment(values)}
              />
            </DialogContent>
          </Dialog>
        </Grid>
        <Metadata title="Class" description="Class page" />
        <CustomDataGrid
          columns={prepareColumns(subject)}
          rows={prepareRows(subject)}
          setOpenNewStudentDialog={handleSetOpenStudent}
          setOpenCreateAssesmentDialog={handleSetOpenAssesment}
          handleSubmitGrade={handleSubmitGrade}
        />
      </Grid>
    </>
  )
}

export default ClassPage
