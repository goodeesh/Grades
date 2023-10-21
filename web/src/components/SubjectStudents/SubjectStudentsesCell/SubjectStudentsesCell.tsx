import type { FindSubjectStudentses } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import SubjectStudentses from 'src/components/SubjectStudents/SubjectStudentses'

export const QUERY = gql`
  query FindSubjectStudentses {
    subjectStudentses {
      id
      subjectId
      userId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No subjectStudentses yet. '}
      <Link to={routes.newSubjectStudents()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  subjectStudentses,
}: CellSuccessProps<FindSubjectStudentses>) => {
  return <SubjectStudentses subjectStudentses={subjectStudentses} />
}
