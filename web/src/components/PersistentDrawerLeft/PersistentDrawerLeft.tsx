import { useEffect } from 'react'

import { useMutation } from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import HomeIcon from '@mui/icons-material/Home'
// import LoginIcon from '@mui/icons-material/Login'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleIcon from '@mui/icons-material/People'
import { Box, Button, Grid, MenuItem, Select } from '@mui/material'
import {
  styled,
  useTheme,
  Theme,
  CSSObject,
  createTheme,
  ThemeProvider,
} from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { User } from 'types/graphql'

import { Link } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import Routes from 'src/Routes'

const CHANGUE_ROLE_MUTATION = gql`
  mutation ChangeRoleMutation($input: ChangueRoleInput!) {
    changueRole(input: $input) {
      role
    }
  }
`

const GET_USER_QUERY = gql`
  query GetUserQuery($input: GetUserByEmail!) {
    getUserByEmail(input: $input) {
      id
      name
      lastName
      email
      role
      darkMode
    }
  }
`

const SET_DARK_MODE_MUTATION = gql`
  mutation SetDarkModeMutation($input: SetDarkModeForUserInput!) {
    setDarkModeForUser(input: $input) {
      darkMode
    }
  }
`

export const routes = {
  home: () => '/',
  classes: () => '/classes',
  signIn: () => '/sign-in',
  signUp: () => '/sign-up',
  profile: () => '/profile',
  // Define other routes as needed
}

const mainNavbarItems = [
  {
    id: 0,
    icon: <HomeIcon />,
    label: 'Home',
    route: routes.home,
  },
  {
    id: 1,
    icon: <PeopleIcon />,
    label: 'Classes',
    route: routes.classes,
  },
  //let's remove the sign in page for the moment
  // {
  //   id: 2,
  //   icon: <LoginIcon />,
  //   label: 'Sign In',
  //   route: routes.signIn,
  // },
  {
    id: 3,
    icon: <PeopleIcon />,
    label: 'Profile',
    route: routes.profile,
  },
]

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))
export const UserContext = React.createContext<User | null>(null)
export default function MiniDrawer() {
  const { user, isAuthenticated, logout, loginWithPopup } = useAuth0()
  const { data, loading } = useQuery(GET_USER_QUERY, {
    variables: { input: { email: user?.email } },
    skip: !user,
  })
  const userData: User = data?.getUserByEmail
  const theme: Theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [role, setRole] = React.useState('')
  const [roleChanged, setRoleChanged] = React.useState(false)
  const [changueRole] = useMutation(CHANGUE_ROLE_MUTATION)
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [setDarkMode] = useMutation(SET_DARK_MODE_MUTATION)
  useEffect(() => {
    if (userData?.role) {
      setRole(userData.role)
    }
    if (user && roleChanged) {
      changueRole({
        variables: {
          input: { email: user.email, role: role },
        },
        refetchQueries: [
          {
            query: GET_USER_QUERY,
            variables: { input: { email: user.email } },
          },
        ],
      })
    }
    if (userData?.darkMode) {
      setIsDarkMode(userData.darkMode)
    }
    setRoleChanged(false) // Reset roleChanged to false after calling changueRole
  }, [role, user, changueRole, userData, roleChanged])

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setRole(event.target.value)
    setRoleChanged(true)
  }

  const [open, setOpen] = React.useState(false)

  const handleLogin = () => {
    if (isAuthenticated) {
      logout({ logoutParams: { returnTo: window.location.origin } })
    } else {
      loginWithPopup()
    }
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }
  function generateTo(item: {
    id?: number
    icon?: React.JSX.Element
    label?: string
    route?: () => string
  }) {
    if (item.route) {
      return item.route()
    }
    // handle the case when route is undefined
    // for example, return a default route
    return '/'
  }
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
        },
      })}
    >
      <Grid
        position="fixed"
        style={{
          width: '100%',
          paddingLeft: isMobile
            ? theme.spacing(1)
            : open
            ? drawerWidth
            : theme.spacing(8),
        }}
      >
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Grades
            </Typography>
            {isAuthenticated && (
              <Select
                sx={{
                  minWidth: '10%',
                  alignItems: 'flex-end',
                  marginLeft: 'auto',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Role"
                onChange={handleChange}
                value={role}
              >
                <MenuItem value={'Student'}>Student</MenuItem>
                <MenuItem value={'Teacher'}>Teacher</MenuItem>
              </Select>
            )}
            <Box
              sx={{
                alignItems: 'flex-end',
                marginLeft: isAuthenticated ? '2%' : 'auto',
              }}
            >
              <Button
                color="inherit"
                onClick={() => {
                  setIsDarkMode(!isDarkMode)
                  if (userData) {
                    setDarkMode({
                      variables: {
                        input: { id: userData.id, darkMode: !isDarkMode },
                      },
                    })
                  }
                }}
              >
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to  Dark Mode'}
              </Button>
              <Button color="inherit" onClick={handleLogin}>
                {isAuthenticated ? 'Log down' : 'Log in'}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant={isMobile && !open ? 'temporary' : 'permanent'}
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <List>
            {mainNavbarItems.map((item, _index) => (
              <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  component={Link}
                  to={generateTo(item)}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'initial',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 3,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Grid
          component="main"
          sx={{
            flexGrow: 1,
            p: 1,
            width: '100%',
          }}
        >
          <DrawerHeader />
          {userData ? (
            <UserContext.Provider value={userData}>
              <Routes />
            </UserContext.Provider>
          ) : (
            <Routes />
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
