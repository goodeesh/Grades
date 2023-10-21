import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import SubjectStudentsForm from 'src/components/SubjectStudents/SubjectStudentsForm'

import type { CreateSubjectStudentsInput } from 'types/graphql'

const CREATE_SUBJECT_STUDENTS_MUTATION = gql`
  mutation CreateSubjectStudentsMutation($input: CreateSubjectStudentsInput!) {
    createSubjectStudents(input: $input) {
      id
    }
  }
`

const NewSubjectStudents = () => {
  const [createSubjectStudents, { loading, error }] = useMutation(
    CREATE_SUBJECT_STUDENTS_MUTATION,
    {
      onCompleted: () => {
        toast.success('SubjectStudents created')
        navigate(routes.subjectStudentses())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateSubjectStudentsInput) => {
    createSubjectStudents({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New SubjectStudents</h2>
      </header>
      <div className="rw-segment-main">
        <SubjectStudentsForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewSubjectStudents
