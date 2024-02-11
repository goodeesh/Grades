import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

import type { EditAssignmentById, UpdateAssignmentInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormAssignment = NonNullable<EditAssignmentById['assignment']>

interface AssignmentFormProps {
  assignment?: EditAssignmentById['assignment']
  onSave: (data: UpdateAssignmentInput, id?: FormAssignment['id']) => void
  error: RWGqlError
  loading: boolean
}

const AssignmentForm = (props: AssignmentFormProps) => {
  const onSubmit = (data: FormAssignment) => {
    props.onSave(data, props?.assignment?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormAssignment> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="title"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>

        <TextField
          name="title"
          defaultValue={props.assignment?.title}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="title" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.assignment?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="dueDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Due date
        </Label>

        <DatetimeLocalField
          name="dueDate"
          defaultValue={formatDatetime(props.assignment?.dueDate)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="dueDate" className="rw-field-error" />

        <Label
          name="subjectId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Subject id
        </Label>

        <TextField
          name="subjectId"
          defaultValue={props.assignment?.subjectId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="subjectId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default AssignmentForm
