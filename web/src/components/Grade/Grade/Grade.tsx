import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

import type { DeleteGradeMutationVariables, FindGradeById } from 'types/graphql'

const DELETE_GRADE_MUTATION = gql`
  mutation DeleteGradeMutation($id: Int!) {
    deleteGrade(id: $id) {
      id
    }
  }
`

interface Props {
  grade: NonNullable<FindGradeById['grade']>
}

const Grade = ({ grade }: Props) => {
  const [deleteGrade] = useMutation(DELETE_GRADE_MUTATION, {
    onCompleted: () => {
      toast.success('Grade deleted')
      navigate(routes.grades())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteGradeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete grade ' + id + '?')) {
      deleteGrade({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Grade {grade.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{grade.id}</td>
            </tr>
            <tr>
              <th>Subject id</th>
              <td>{grade.subjectId}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{grade.userId}</td>
            </tr>
            <tr>
              <th>Grade</th>
              <td>{grade.grade}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{grade.date}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editGrade({ id: grade.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(grade.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Grade
