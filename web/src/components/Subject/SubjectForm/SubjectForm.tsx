import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import type { EditSubjectById, UpdateSubjectInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

type FormSubject = NonNullable<EditSubjectById['subject']>

interface SubjectFormProps {
  subject?: EditSubjectById['subject']
  onSave: (data: UpdateSubjectInput, id?: FormSubject['id']) => void
  error: RWGqlError
  loading: boolean
}

const SubjectForm = (props: SubjectFormProps) => {
  const onSubmit = (data: FormSubject) => {
    props.onSave(data, props?.subject?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormSubject> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="teacherId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Teacher id
        </Label>

        <NumberField
          name="teacherId"
          defaultValue={props.subject?.teacherId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="teacherId" className="rw-field-error" />

        <Label
          name="subjectName"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Subject name
        </Label>

        <TextField
          name="subjectName"
          defaultValue={props.subject?.subjectName}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="subjectName" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default SubjectForm
