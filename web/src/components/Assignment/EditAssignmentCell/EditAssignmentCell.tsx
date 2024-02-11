import type { EditAssignmentById, UpdateAssignmentInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AssignmentForm from 'src/components/Assignment/AssignmentForm'

export const QUERY = gql`
  query EditAssignmentById($id: String!) {
    assignment: assignment(id: $id) {
      id
      title
      description
      createdAt
      dueDate
      subjectId
    }
  }
`
const UPDATE_ASSIGNMENT_MUTATION = gql`
  mutation UpdateAssignmentMutation(
    $id: String!
    $input: UpdateAssignmentInput!
  ) {
    updateAssignment(id: $id, input: $input) {
      id
      title
      description
      createdAt
      dueDate
      subjectId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  assignment,
}: CellSuccessProps<EditAssignmentById>) => {
  const [updateAssignment, { loading, error }] = useMutation(
    UPDATE_ASSIGNMENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('Assignment updated')
        navigate(routes.assignments())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateAssignmentInput,
    id: EditAssignmentById['assignment']['id']
  ) => {
    updateAssignment({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Assignment {assignment?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <AssignmentForm
          assignment={assignment}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
