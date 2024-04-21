import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, Grid, Typography } from '@mui/material'

import { useMutation } from '@redwoodjs/web'

import { UserContext } from 'src/components/PersistentDrawerLeft'

const CHANGUE_ROLE_MUTATION = gql`
  mutation ChangeRoleMutation($input: ChangueRoleInput!) {
    changueRole(input: $input) {
      role
    }
  }
`
const HomePage = () => {
  const userData = React.useContext(UserContext)
  const { user } = useAuth0()
  const [changueRoleMutation] = useMutation(CHANGUE_ROLE_MUTATION)

  if (userData?.role === 'Teacher') {
    return (
      <>
        <Grid component="main" maxWidth="xs">
          <Box textAlign="center" margin="auto">
            <Typography variant="h4" gutterBottom>
              Welcome {userData?.name}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              You are logged in as a teacher.
            </Typography>
          </Box>
        </Grid>
      </>
    )
  }
  if (userData?.role === 'Student') {
    return (
      <>
        <Grid component="main" maxWidth="xs">
          <Box textAlign="center" margin="auto">
            <Typography variant="h4" gutterBottom>
              Welcome {userData?.name}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              You are logged in as a student.
            </Typography>
          </Box>
        </Grid>
      </>
    )
  }
  if (user) {
    return (
      <>
        <Grid component="main" maxWidth="xs">
          <Box textAlign="center" margin="auto">
            <Typography variant="h4" gutterBottom>
              Welcome {userData?.name}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Would you like to use the app as a student or as a teacher?
            </Typography>
            <Typography variant="body1">
              <Button
                onClick={() => {
                  changueRoleMutation({
                    variables: {
                      input: { email: userData?.name, role: 'Student' },
                    },
                  }).then(() => {
                    window.location.reload()
                  })
                }}
                sx={{
                  marginRight: 2,
                }}
                variant="contained"
              >
                Student
              </Button>
              <Button
                onClick={() => {
                  changueRoleMutation({
                    variables: {
                      input: { email: userData?.name, role: 'Teacher' },
                    },
                  }).then(() => {
                    window.location.reload()
                  })
                }}
                sx={{
                  marginLeft: 2,
                }}
                variant="contained"
              >
                Teacher
              </Button>
            </Typography>
          </Box>
        </Grid>
      </>
    )
  }
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
