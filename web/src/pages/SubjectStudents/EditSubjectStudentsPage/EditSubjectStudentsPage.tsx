import EditSubjectStudentsCell from 'src/components/SubjectStudents/EditSubjectStudentsCell'

type SubjectStudentsPageProps = {
  id: number
}

const EditSubjectStudentsPage = ({ id }: SubjectStudentsPageProps) => {
  return <EditSubjectStudentsCell id={id} />
}

export default EditSubjectStudentsPage
