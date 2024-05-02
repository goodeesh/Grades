import React from 'react'

import { Auth0Provider } from '@auth0/auth0-react'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'

import './index.css'
import PersistentDrawerLeft from './components/PersistentDrawerLeft/PersistentDrawerLeft'

const App = () => (
  <Auth0Provider
    domain="dev-qq1y7rqwp0ybcyvd.us.auth0.com"
    clientId="8yUhTgyOTvWeQrRWCwnOQUj8pJrx6eq8"
    cacheLocation="localstorage"
    useRefreshTokens={true}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <FatalErrorBoundary page={FatalErrorPage}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <RedwoodApolloProvider>
          <PersistentDrawerLeft />
        </RedwoodApolloProvider>
      </RedwoodProvider>
    </FatalErrorBoundary>
  </Auth0Provider>
)

export default App
