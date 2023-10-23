import { Box, Button, Grid, Typography } from '@mui/material'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <Grid component="main" maxWidth="xs">
        <Box textAlign="center" margin="auto">
          <Typography variant="h4" gutterBottom>
            Welcome to the home page!
          </Typography>
          <Typography variant="body1" gutterBottom>
            In order to use the app, an account is required.
          </Typography>
          <Typography variant="body1">
            If you already have an account, please sign in. Otherwise, please
            sign up.
          </Typography>
        </Box>
      </Grid>
    </>
  )
}

export default HomePage
