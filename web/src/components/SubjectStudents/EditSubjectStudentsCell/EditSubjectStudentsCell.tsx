import type {
  EditSubjectStudentsById,
  UpdateSubjectStudentsInput,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import SubjectStudentsForm from 'src/components/SubjectStudents/SubjectStudentsForm'

export const QUERY = gql`
  query EditSubjectStudentsById($id: Int!) {
    subjectStudents: subjectStudents(id: $id) {
      id
      subjectId
      userId
    }
  }
`
const UPDATE_SUBJECT_STUDENTS_MUTATION = gql`
  mutation UpdateSubjectStudentsMutation(
    $id: Int!
    $input: UpdateSubjectStudentsInput!
  ) {
    updateSubjectStudents(id: $id, input: $input) {
      id
      subjectId
      userId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  subjectStudents,
}: CellSuccessProps<EditSubjectStudentsById>) => {
  const [updateSubjectStudents, { loading, error }] = useMutation(
    UPDATE_SUBJECT_STUDENTS_MUTATION,
    {
      onCompleted: () => {
        toast.success('SubjectStudents updated')
        navigate(routes.subjectStudentses())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateSubjectStudentsInput,
    id: EditSubjectStudentsById['subjectStudents']['id']
  ) => {
    updateSubjectStudents({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit SubjectStudents {subjectStudents?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <SubjectStudentsForm
          subjectStudents={subjectStudents}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
