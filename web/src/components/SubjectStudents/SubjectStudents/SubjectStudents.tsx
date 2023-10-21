import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

import type {
  DeleteSubjectStudentsMutationVariables,
  FindSubjectStudentsById,
} from 'types/graphql'

const DELETE_SUBJECT_STUDENTS_MUTATION = gql`
  mutation DeleteSubjectStudentsMutation($id: Int!) {
    deleteSubjectStudents(id: $id) {
      id
    }
  }
`

interface Props {
  subjectStudents: NonNullable<FindSubjectStudentsById['subjectStudents']>
}

const SubjectStudents = ({ subjectStudents }: Props) => {
  const [deleteSubjectStudents] = useMutation(
    DELETE_SUBJECT_STUDENTS_MUTATION,
    {
      onCompleted: () => {
        toast.success('SubjectStudents deleted')
        navigate(routes.subjectStudentses())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onDeleteClick = (id: DeleteSubjectStudentsMutationVariables['id']) => {
    if (
      confirm('Are you sure you want to delete subjectStudents ' + id + '?')
    ) {
      deleteSubjectStudents({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            SubjectStudents {subjectStudents.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{subjectStudents.id}</td>
            </tr>
            <tr>
              <th>Subject id</th>
              <td>{subjectStudents.subjectId}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{subjectStudents.userId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editSubjectStudents({ id: subjectStudents.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(subjectStudents.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default SubjectStudents
