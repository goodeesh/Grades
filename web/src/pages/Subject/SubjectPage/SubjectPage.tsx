import SubjectCell from 'src/components/Subject/SubjectCell'

type SubjectPageProps = {
  id: number
}

const SubjectPage = ({ id }: SubjectPageProps) => {
  return <SubjectCell id={id} />
}

export default SubjectPage
