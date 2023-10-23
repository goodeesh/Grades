import { useAuth0 } from '@auth0/auth0-react'
import { Box, Grid, Typography } from '@mui/material'
import { gql } from 'graphql-tag'
export const QUERY = gql`
  query FindUserById($id: String!) {
    user: user(id: $id) {
      id
      role
      name
      lastName
    }
  }
`

import { useQuery } from '@redwoodjs/web'

import UserCell from 'src/components/User/UserCell/'

const HomePage = () => {
  let id = ''
  // look if user is in database . if not, create user
  const { user } = useAuth0()
  id = user ? user.email : ''
  const { data } = useQuery(QUERY, { variables: { id } })
  console.log(data)
  const userDb = data?.user
  console.log(userDb)
  return (
    <>
      <UserCell id={id} />
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
