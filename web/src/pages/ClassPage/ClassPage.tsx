import { useMutation } from '@apollo/client'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Rating,
  Tooltip,
} from '@mui/material'
import {
  GridCloseIcon,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { Assignment, Maybe, Subject, User } from 'types/graphql'

import { useParams } from '@redwoodjs/router'
import { Metadata, useQuery } from '@redwoodjs/web'

import CustomDataGrid from 'src/components/DataGrid/DataGrid'
import { MyForm as MyFormCreateAssignment } from 'src/components/Forms/NewAssignment/MyForm'
import { MyForm as MyFormNewStudent } from 'src/components/Forms/NewStudent/MyForm'

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

const CREATE_NEW_ASSIGNMENT = gql`
  mutation CreateNewAssignment($input: CreateAssignmentInput!) {
    createAssignment(input: $input) {
      id
      title
    }
  }
`

const UPDATE_ASSIGNMENT = gql`
  mutation updateAssignment($id: String!, $input: UpdateAssignmentInput!) {
    updateAssignment(id: $id, input: $input) {
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

type AssignmentGrade = {
  grade: number | null
  gradeId: string | null
}

type StudentRowBase = {
  id: string
  name: string
  editable: boolean
}

type StudentRow = StudentRowBase & {
  [key: string]: AssignmentGrade | StudentRowBase[keyof StudentRowBase]
}

const ClassPage = () => {
  const { id } = useParams()
  const { data, loading, refetch } = useQuery(GET_SUBJECT_BY_ID, {
    variables: { id },
  })
  const [updateGrade] = useMutation(UPDATE_GRADE)
  const [createGrade] = useMutation(CREATE_GRADE)
  const [createStudent] = useMutation(CREATE_STUDENT)
  const [createAssignment] = useMutation(CREATE_NEW_ASSIGNMENT)
  const [createSubjectStudent] = useMutation(CREATE_USER_SUBJECT)
  const [updateAssignment] = useMutation(UPDATE_ASSIGNMENT)
  const [openStudent, setOpenStudent] = React.useState(false)
  const [openAssignment, setOpenAssignment] = React.useState(false)
  const [assignmentId, setAssignmentId] = React.useState<Assignment | null>(
    null
  )

  if (loading) {
    return <div>Loading...</div>
  } else if (!data) {
    return <div>Class was not found</div>
  }

  const subject: Subject = data.subject
  const prepareRows = (subject: Subject) => {
    const rows: Maybe<StudentRow>[] = subject.students.map(
      (student: Maybe<User>) => {
        if (!student) {
          return null
        }
        const studentRow: StudentRow = {
          id: student.id,
          name: student.name + ' ' + student?.lastName,
          editable: true,
        }
        subject.assignments?.forEach((assignment: Maybe<Assignment>) => {
          const grade = assignment?.grades.find(
            (grade) => grade?.userId === student?.id
          )
          if (grade && assignment?.id) {
            studentRow[assignment.id] = {
              grade: grade.grade,
              gradeId: grade.id,
            }
          } else if (assignment?.id) {
            studentRow[assignment.id] = {
              grade: null,
              gradeId: null,
            }
          }
        })
        return studentRow
      }
    )
    return rows.filter((row): row is StudentRow => row !== null)
  }

  const prepareColumns = (subject: Subject) => {
    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: false,
      },
    ]
    let restColumns: Maybe<GridColDef>[] = []
    if (subject.assignments) {
      restColumns = subject.assignments.map((assignment: Maybe<Assignment>) => {
        if (!assignment) {
          return null
        }
        return {
          id: assignment.id,
          field: assignment.id,
          headerName: assignment.title,
          type: 'number',
          editable: true,
          gradeId: (params: GridRenderCellParams) => params.value.gradeId,
          renderCell: (params) => (
            <Rating
              name="simple-controlled"
              size="small"
              value={params.value.grade}
              onChange={(event, value) => {
                const assignmentId = params.field
                const studentId = params.row.id // Assuming the studentId is stored in the 'id' field of the row
                const grade = value
                const gradeId = params.value.gradeId
                if (grade) {
                  handleSubmitGrade(
                    assignmentId,
                    studentId,
                    grade.toString(),
                    gradeId
                  )
                  params.value.grade = grade
                  //deselect row in mui
                  params.api.selectRow(params.id, false, false)
                }
              }}
            />
          ),
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
      })
    }
    const restColumnsFiltered: GridColDef[] = restColumns.filter(
      (column): column is GridColDef => column !== null
    )
    restColumnsFiltered?.forEach((column) => {
      columns.push(column)
    })
    return columns
  }

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
    //refetch()
  }

  const handleSubmitNewStudent = async (values: {
    firstName: string
    lastName: string
  }) => {
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

  const handleSubmitCreateOrUpdateAssignment = async (
    values: {
      title: string
      date: dayjs.Dayjs
      description: string
    },
    assignmentId: string
  ) => {
    const input = {
      title: values.title,
      subjectId: id,
      date: values.date,
      description: values.description,
    }
    if (assignmentId) {
      await updateAssignment({ variables: { id: assignmentId, input: input } })
    } else {
      await createAssignment({ variables: { input: input } })
    }
    setOpenAssignment(false)
    refetch()
  }
  const handleSetOpenStudent = () => {
    setOpenStudent(!openStudent)
  }
  const handleSetOpenAssignment = (id: string) => {
    console.log(id) // You can use the id here
    const assignment: Assignment | null = data.subject.assignments?.find(
      (assignment: Assignment) => assignment?.id === id
    )
    setAssignmentId(assignment)
    setOpenAssignment(!openAssignment)
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
          <Dialog
            open={openAssignment}
            onClose={() => setOpenAssignment(false)}
          >
            <DialogTitle>New assignment</DialogTitle>
            <IconButton
              style={{ position: 'absolute', right: '8px', top: '8px' }}
              onClick={() => setOpenAssignment(false)}
            >
              <GridCloseIcon />
            </IconButton>
            <DialogContent>
              <MyFormCreateAssignment
                onSubmit={(values: {
                  title: string
                  date: dayjs.Dayjs
                  description: string
                }) =>
                  handleSubmitCreateOrUpdateAssignment(
                    values,
                    assignmentId?.id ?? ''
                  )
                }
                assignment={assignmentId}
              />
            </DialogContent>
          </Dialog>
        </Grid>
        <Metadata title="Class" description="Class page" />
        <CustomDataGrid
          columns={prepareColumns(subject)}
          rows={prepareRows(subject)}
          setOpenNewStudentDialog={handleSetOpenStudent}
          setOpenCreateAssessmentDialog={handleSetOpenAssignment}
          handleSubmitGrade={handleSubmitGrade}
        />
      </Grid>
    </>
  )
}

export default ClassPage
