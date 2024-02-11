import type { FindAssignments } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Assignments from 'src/components/Assignment/Assignments'

export const QUERY = gql`
  query FindAssignments {
    assignments {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No assignments yet. '}
      <Link to={routes.newAssignment()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ assignments }: CellSuccessProps<FindAssignments>) => {
  return <Assignments assignments={assignments} />
}
