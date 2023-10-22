import React from 'react'

import { useAuth0 } from '@auth0/auth0-react'

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return <div>Loading ...</div>
  }

  if (!isAuthenticated) {
    // User is not authenticated, so they shouldn't access the profile
    return <div>You must be logged in to access this page.</div>
  }
  console.log(user)
  // User is authenticated, display the profile
  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

export default Profile
