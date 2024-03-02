import GradeCell from 'src/components/Grade/GradeCell'

type GradePageProps = {
  id: string
}

const GradePage = ({ id }: GradePageProps) => {
  return <GradeCell id={id} />
}

export default GradePage
