import * as React from 'react'

import { Box, Button, Grid } from '@mui/material'

import { MyForm } from 'src/components/Forms/NewClass/MyForm'
import { UserContext } from 'src/components/PersistentDrawerLeft'

const ClassesPage = () => {
  const userData = React.useContext(UserContext)
  const [addNewClass, setAddNewClass] = React.useState(false) // Initialize addNewClass with false

  return (
    <>
      <Grid component="main" maxWidth="xs" textAlign="center" margin="auto">
        <Button
          variant="contained"
          onClick={() => setAddNewClass(!addNewClass)}
        >
          Add a new Class
        </Button>{' '}
        {/* Set addNewClass to true when the button is clicked */}
        <br />
        <Box textAlign="center" margin="auto">
          <br />
          {addNewClass && ( // Render DemoPaper if addNewClass is true
            <MyForm onSubmit={(values) => console.log(values)} />
          )}
        </Box>
      </Grid>
    </>
  )
}

export default ClassesPage
