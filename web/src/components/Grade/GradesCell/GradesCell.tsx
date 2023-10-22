import type { FindGrades } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Grades from 'src/components/Grade/Grades'

export const QUERY = gql`
  query FindGrades {
    grades {
      id
      subjectId
      userId
      grade
      date
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No grades yet. '}
      <Link to={routes.newGrade()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ grades }: CellSuccessProps<FindGrades>) => {
  return <Grades grades={grades} />
}
