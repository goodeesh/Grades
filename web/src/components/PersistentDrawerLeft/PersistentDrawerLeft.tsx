import { useEffect } from 'react'

import { useMutation } from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import HomeIcon from '@mui/icons-material/Home'
import LoginIcon from '@mui/icons-material/Login'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleIcon from '@mui/icons-material/People'
import { Button, MenuItem, Select } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

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
  {
    id: 2,
    icon: <LoginIcon />,
    label: 'Sign In',
    route: routes.signIn,
  },
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
export const UserContext = React.createContext(null)
export default function MiniDrawer() {
  const { user, isAuthenticated, logout, loginWithPopup } = useAuth0()
  const { data: userData, loading } = useQuery(GET_USER_QUERY, {
    variables: { input: { email: user?.email } },
    skip: !user,
  })
  const [role, setRole] = React.useState('')
  const [roleChanged, setRoleChanged] = React.useState(false)
  const [changueRole] = useMutation(CHANGUE_ROLE_MUTATION)
  useEffect(() => {
    if (userData?.getUserByEmail?.role) {
      setRole(userData.getUserByEmail.role)
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
    setRoleChanged(false) // Reset roleChanged to false after calling changueRole
  }, [role, user, changueRole, userData, roleChanged])

  const handleChange = (event) => {
    setRole(event.target.value)
    setRoleChanged(true)
  }
  const theme = useTheme()
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
  function generateTo(item) {
    return item.route()
  }
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <Box sx={{ display: 'flex' }}>
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
          <Button
            sx={{
              alignItems: 'flex-end',
              marginLeft: isAuthenticated ? '2%' : 'auto',
            }}
            color="inherit"
            onClick={handleLogin}
          >
            {isAuthenticated ? 'Log down' : 'Log in'}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
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
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />

        {userData ? (
          <UserContext.Provider value={userData}>
            <Routes />
          </UserContext.Provider>
        ) : (
          <Routes />
        )}
      </Box>
    </Box>
  )
}
