import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Grade/GradesCell'
import { truncate } from 'src/lib/formatters'

import type { DeleteGradeMutationVariables, FindGrades } from 'types/graphql'

const DELETE_GRADE_MUTATION = gql`
  mutation DeleteGradeMutation($id: String!) {
    deleteGrade(id: $id) {
      id
    }
  }
`

const GradesList = ({ grades }: FindGrades) => {
  const [deleteGrade] = useMutation(DELETE_GRADE_MUTATION, {
    onCompleted: () => {
      toast.success('Grade deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteGradeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete grade ' + id + '?')) {
      deleteGrade({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Grade</th>
            <th>Date</th>
            <th>User id</th>
            <th>Assignment id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id}>
              <td>{truncate(grade.id)}</td>
              <td>{truncate(grade.grade)}</td>
              <td>{truncate(grade.date)}</td>
              <td>{truncate(grade.userId)}</td>
              <td>{truncate(grade.assignmentId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.grade({ id: grade.id })}
                    title={'Show grade ' + grade.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editGrade({ id: grade.id })}
                    title={'Edit grade ' + grade.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete grade ' + grade.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(grade.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GradesList
