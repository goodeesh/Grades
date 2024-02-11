import type { FindAssignmentById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Assignment from 'src/components/Assignment/Assignment'

export const QUERY = gql`
  query FindAssignmentById($id: String!) {
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Assignment not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  assignment,
}: CellSuccessProps<FindAssignmentById>) => {
  return <Assignment assignment={assignment} />
}
