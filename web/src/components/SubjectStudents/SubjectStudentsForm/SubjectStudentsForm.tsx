import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import type {
  EditSubjectStudentsById,
  UpdateSubjectStudentsInput,
} from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

type FormSubjectStudents = NonNullable<
  EditSubjectStudentsById['subjectStudents']
>

interface SubjectStudentsFormProps {
  subjectStudents?: EditSubjectStudentsById['subjectStudents']
  onSave: (
    data: UpdateSubjectStudentsInput,
    id?: FormSubjectStudents['id']
  ) => void
  error: RWGqlError
  loading: boolean
}

const SubjectStudentsForm = (props: SubjectStudentsFormProps) => {
  const onSubmit = (data: FormSubjectStudents) => {
    props.onSave(data, props?.subjectStudents?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormSubjectStudents> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="subjectId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Subject id
        </Label>

        <NumberField
          name="subjectId"
          defaultValue={props.subjectStudents?.subjectId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="subjectId" className="rw-field-error" />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>

        <TextField
          name="userId"
          defaultValue={props.subjectStudents?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="userId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default SubjectStudentsForm
