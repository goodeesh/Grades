import React, { useEffect } from 'react'

import { gql, useMutation } from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'

import { navigate } from '@redwoodjs/router'

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      lastName
      email
    }
  }
`

const LoginButton = () => {
  const { user, isAuthenticated, isLoading, loginWithPopup, logout } =
    useAuth0()
  const [createUser] = useMutation(CREATE_USER_MUTATION)

  useEffect(() => {
    if (isAuthenticated && user) {
      const { email, name, family_name } = user
      const input = {
        email,
        name,
        lastName: family_name,
      }

      createUser({ variables: { input } }).then(() => {
        console.log('User created successfully!')
      })
      navigate('/')
    }
    //add redirect to home page
  }, [isAuthenticated, user, createUser])

  if (isLoading) {
    return <div>Loading ...</div>
  }

  if (isAuthenticated) {
    return <div>Logged in</div>
  }

  return (
    <>
      <button onClick={() => loginWithPopup()}>Log In</button>
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log Out
      </button>
    </>
  )
}

export default LoginButton
