import { Grid } from '@mui/material'

import { useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const ClassPage = () => {
  const { id } = useParams()
  console.log('the id is ', id)
  return (
    <>
      <Grid component="main" maxWidth="xs" textAlign="center" margin="auto">
        <Metadata title="Class" description="Class page" />

        <h1>ClassPage</h1>
        <p>
          Find me in <code>./web/src/pages/ClassPage/ClassPage.tsx</code>
        </p>
      </Grid>
    </>
  )
}

export default ClassPage
