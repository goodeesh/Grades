import type { FindSubjectStudentsById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import SubjectStudents from 'src/components/SubjectStudents/SubjectStudents'

export const QUERY = gql`
  query FindSubjectStudentsById($id: Int!) {
    subjectStudents: subjectStudents(id: $id) {
      id
      subjectId
      userId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>SubjectStudents not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  subjectStudents,
}: CellSuccessProps<FindSubjectStudentsById>) => {
  return <SubjectStudents subjectStudents={subjectStudents} />
}
