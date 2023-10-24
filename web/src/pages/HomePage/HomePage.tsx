import { useAuth0 } from '@auth0/auth0-react'
import { Box, Grid, Typography } from '@mui/material'

const HomePage = () => {
  let id = ''
  // look if user is in database . if not, create user
  const { user } = useAuth0()
  id = user?.email
  console.log(id)
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
