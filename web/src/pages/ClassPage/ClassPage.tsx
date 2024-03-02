import { useMutation } from '@apollo/client'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material'
import { GridCloseIcon } from '@mui/x-data-grid'

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
      }
      assignments {
        id
        title
        createdAt
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

const prepareColumns = (subject) => {
  const columns = [
    {
      id: 'name',
      field: 'name',
      headerName: 'Student Name',
      width: 150,
      editable: false,
    },

    ...subject.assignments.map((assignment) => {
      return {
        id: assignment.id,
        field: assignment.id,
        headerName: assignment.title,
        type: 'number',
        width: 120,
        editable: true,
        gradeId: (params) => params.value.gradeId,
        renderCell: (params) => (params.value.grade ? params.value.grade : ''),
      }
    }),
  ]
  return columns
}

const prepareRows = (subject) => {
  const rows = subject.students.map((student) => {
    const studentRow = {
      id: student.id,
      name: student.name,
      editable: true,
    }
    subject.assignments.forEach((assignment) => {
      const grade = assignment.grades.find(
        (grade) => grade.userId === student.id
      )
      studentRow[assignment.id] = {
        grade: grade?.grade,
        gradeId: grade?.id,
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

  const [updateGrade] = useMutation(UPDATE_GRADE, {
    onCompleted: () => {
      console.log('Grade updated successfully!')
    },
  })

  const [createGrade] = useMutation(CREATE_GRADE, {
    onCompleted: () => {
      console.log('Grade created successfully!')
    },
  })
  const [createStudent] = useMutation(CREATE_STUDENT, {
    onCompleted: () => {
      console.log('Student created successfully!')
    },
  })
  const [createAssesment] = useMutation(CREATE_NEW_ASSESMENT, {
    onCompleted: () => {
      console.log('Assesment created successfully!')
    },
  })
  const [createSubjectStudent] = useMutation(CREATE_USER_SUBJECT, {
    onCompleted: () => {
      console.log('Student added to class successfully!')
      refetch()
    },
  })
  const handleSubmitGrade = (
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
      console.log('input', input)
      createGrade({ variables: { input: input } })
    }
    refetch()
  }

  const handleSubmitNewStudent = (values) => {
    console.log('values', values)
    const handleSubmitCreateStudent = async (values) => {
      const input = {
        name: values.firstName + ' ' + values.lastName,
        role: 'student',
        lastName: values.lastName,
      }

      const user = await createStudent({ variables: { input } }) // Await the createStudent mutation
      console.log(user, 'user')
      const input2 = {
        subjectId: id,
        userId: user.data.createUser.id, // Access the id property from the resolved value
      }
      createSubjectStudent({ variables: { input: input2 } })
      setOpenStudent(false)
    }

    handleSubmitCreateStudent(values)
  }
  const handleSubmitCreateAssesment = (values) => {
    const input = {
      title: values.title,
      subjectId: id,
    }
    createAssesment({ variables: { input: input } })
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
          columns={prepareColumns(data?.subject)}
          rows={prepareRows(data?.subject)}
          setOpenNewStudentDialog={handleSetOpenStudent}
          setOpenCreateAssesmentDialog={handleSetOpenAssesment}
          handleSubmitGrade={handleSubmitGrade}
        />
      </Grid>
    </>
  )
}

export default ClassPage
