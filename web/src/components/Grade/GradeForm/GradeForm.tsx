import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import type { EditGradeById, UpdateGradeInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

type FormGrade = NonNullable<EditGradeById['grade']>

interface GradeFormProps {
  grade?: EditGradeById['grade']
  onSave: (data: UpdateGradeInput, id?: FormGrade['id']) => void
  error: RWGqlError
  loading: boolean
}

const GradeForm = (props: GradeFormProps) => {
  const onSubmit = (data: FormGrade) => {
    props.onSave(data, props?.grade?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormGrade> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="grade"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Grade
        </Label>

        <NumberField
          name="grade"
          defaultValue={props.grade?.grade}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="grade" className="rw-field-error" />

        <Label
          name="date"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Date
        </Label>

        <TextField
          name="date"
          defaultValue={props.grade?.date}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="date" className="rw-field-error" />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>

        <TextField
          name="userId"
          defaultValue={props.grade?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="assignmentId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Assignment id
        </Label>

        <TextField
          name="assignmentId"
          defaultValue={props.grade?.assignmentId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="assignmentId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default GradeForm
