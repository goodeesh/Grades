import EditGradeCell from 'src/components/Grade/EditGradeCell'

type GradePageProps = {
  id: number
}

const EditGradePage = ({ id }: GradePageProps) => {
  return <EditGradeCell id={id} />
}

export default EditGradePage
