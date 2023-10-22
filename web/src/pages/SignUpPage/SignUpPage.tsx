/* import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const SignUpPage = () => {
  return (
    <>
      <MetaTags title="SignUp" description="SignUp page" />

      <h1>SignUpPage</h1>
      <p>
        Find me in <code>./web/src/pages/SignUpPage/SignUpPage.tsx</code>
      </p>
      <p>
        My default route is named <code>signUp</code>, link to me with `
        <Link to={routes.signUp()}>SignUp</Link>`
      </p>
    </>
  )
}

export default SignUpPage */
import { gql, useMutation } from '@apollo/client'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

//add Mutation to create user

export const CREATE_NEW_USER = gql`
  mutation addNewUser($username: String!, $password: String!) {
    addNewUser(username: $username, password: $password) {
      code
      success
      message
      user {
        id
        username
        password
      }
    }
  }
`

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    ></Typography>
  )
}

const theme = createTheme()

export default function SignUp() {
  const [username, setUserName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [addNewUser, { data: mutationData }] = useMutation(CREATE_NEW_USER)
  const HandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault()
    }
    async function callMutation(username: string, password: string) {
      try {
        await addNewUser({
          variables: {
            username: username,
            password: password,
          },
        })
      } catch (error) {
        console.error('Error adding new user:', error)
      }
    }
    try {
      callMutation(username, password)
    } catch (error) {
      console.error('Error adding new user:', error)
    }
    console.log('mutationData', mutationData)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={HandleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Enter username"
                  name="username"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="SignIn" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  )
}
