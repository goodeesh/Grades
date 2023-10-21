import SubjectStudentsCell from 'src/components/SubjectStudents/SubjectStudentsCell'

type SubjectStudentsPageProps = {
  id: number
}

const SubjectStudentsPage = ({ id }: SubjectStudentsPageProps) => {
  return <SubjectStudentsCell id={id} />
}

export default SubjectStudentsPage
