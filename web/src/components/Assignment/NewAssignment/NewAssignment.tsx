import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AssignmentForm from 'src/components/Assignment/AssignmentForm'

import type { CreateAssignmentInput } from 'types/graphql'

const CREATE_ASSIGNMENT_MUTATION = gql`
  mutation CreateAssignmentMutation($input: CreateAssignmentInput!) {
    createAssignment(input: $input) {
      id
    }
  }
`

const NewAssignment = () => {
  const [createAssignment, { loading, error }] = useMutation(
    CREATE_ASSIGNMENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('Assignment created')
        navigate(routes.assignments())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateAssignmentInput) => {
    createAssignment({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Assignment</h2>
      </header>
      <div className="rw-segment-main">
        <AssignmentForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewAssignment
