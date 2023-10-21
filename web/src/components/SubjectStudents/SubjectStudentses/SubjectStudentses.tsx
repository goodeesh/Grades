import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/SubjectStudents/SubjectStudentsesCell'
import { truncate } from 'src/lib/formatters'

import type {
  DeleteSubjectStudentsMutationVariables,
  FindSubjectStudentses,
} from 'types/graphql'

const DELETE_SUBJECT_STUDENTS_MUTATION = gql`
  mutation DeleteSubjectStudentsMutation($id: Int!) {
    deleteSubjectStudents(id: $id) {
      id
    }
  }
`

const SubjectStudentsesList = ({
  subjectStudentses,
}: FindSubjectStudentses) => {
  const [deleteSubjectStudents] = useMutation(
    DELETE_SUBJECT_STUDENTS_MUTATION,
    {
      onCompleted: () => {
        toast.success('SubjectStudents deleted')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
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
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Subject id</th>
            <th>User id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {subjectStudentses.map((subjectStudents) => (
            <tr key={subjectStudents.id}>
              <td>{truncate(subjectStudents.id)}</td>
              <td>{truncate(subjectStudents.subjectId)}</td>
              <td>{truncate(subjectStudents.userId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.subjectStudents({ id: subjectStudents.id })}
                    title={
                      'Show subjectStudents ' + subjectStudents.id + ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editSubjectStudents({ id: subjectStudents.id })}
                    title={'Edit subjectStudents ' + subjectStudents.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete subjectStudents ' + subjectStudents.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(subjectStudents.id)}
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

export default SubjectStudentsesList
