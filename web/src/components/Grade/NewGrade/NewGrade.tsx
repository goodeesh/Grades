import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import GradeForm from 'src/components/Grade/GradeForm'

import type { CreateGradeInput } from 'types/graphql'

const CREATE_GRADE_MUTATION = gql`
  mutation CreateGradeMutation($input: CreateGradeInput!) {
    createGrade(input: $input) {
      id
    }
  }
`

const NewGrade = () => {
  const [createGrade, { loading, error }] = useMutation(CREATE_GRADE_MUTATION, {
    onCompleted: () => {
      toast.success('Grade created')
      navigate(routes.grades())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: CreateGradeInput) => {
    createGrade({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Grade</h2>
      </header>
      <div className="rw-segment-main">
        <GradeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewGrade
