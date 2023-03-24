import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import blue from '@mui/material/colors/blue'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import thememodulescss from 'dist/css/theme.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import FileUpload from '../components/FileUpload/FileUpload'
import { mergeClasses } from '../services/utils'
import { addUsers, editUsers } from '../store/actions/usersActions'
import { IState } from '../store/reducers/index'

const aptugotheme = createTheme({
  palette: {
    primary: blue,
  },
})

const localStyles = {
  mainPanel: { ['@media (min-width:960px)']: { backgroundColor: '#56baec', width: '100%', flexGrow: 1 } },
  loginHolder: { margin: '5rem auto 0', width: '30vw', textAlign: 'center' },
  loginArea: {
    position: 'relative',
    background: 'white',
    padding: '4rem 3rem 2rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    boxShadow: '0px 3px 20px 5px #00000030',
  },
  loginTitle: { textTransform: 'uppercase', fontSize: '1.2rem', letterSpacing: '0.1rem', color: '#3084af' },
  image: {
    width: '5rem',
    position: 'absolute',
    top: '-2.5rem',
    left: 'calc(15vw - (2.5rem + 2.5px))',
    border: '5px solid white',
    borderRadius: '5rem',
  },
}
const Register: FunctionComponent = (props: any) => {
  const {
    history: navigation,
    match: { params },
  } = props
  const classes = mergeClasses(baseClasses, localStyles)
  const initialDataUsers = {
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    ProfilePic: '',
    Role: '',
    Lugar: '',
    DireccionLugar: '',
  }
  const [Usersdata, setUsersData] = React.useState<any>(initialDataUsers)
  const handleUsersChange = (name: string) => (event: any) => {
    const value = event?.target ? (event.target.files ? event.target.files[0] : event.currentTarget?.value || event.target.value) : event
    setUsersData({
      ...Usersdata,
      [name]: value,
    })
  }
  const theme = thememodulescss
  const [registerError, setregisterError] = React.useState<any>(null)
  const dispatch = useDispatch()

  // Theme selection

  const usersData = useSelector((state: IState) => state.users)

  const handleRegister = () => {
    const data = { ...Usersdata, Role: 'User' }

    if (data._id) {
      dispatch(editUsers(data as any))
    } else {
      dispatch(addUsers(data as any))
    }
  }

  return (
    <React.Fragment>
      <ThemeProvider theme={aptugotheme}>
        <div className={theme.registerBody}>
          <Container className={theme.loginPage} maxWidth="md">
            <div title="Login Area" className={theme.right}>
              Have an account?
              <a href="/Login">Login!</a>
            </div>

            <div title="Register Box" className={theme.registerBox}>
              <div title="Heading" className={theme.headingRegister}>
                <Typography variant="h3">Register</Typography>

                <Typography variant="body1">Enter your details below.</Typography>
              </div>

              {registerError && (
                <React.Fragment>
                  <Alert variant="standard" severity="error">
                    {registerError}
                  </Alert>
                </React.Fragment>
              )}

              <FileUpload label="Profile Picture" value={Usersdata.ProfilePic} onChange={handleUsersChange('ProfilePic')} variant="outlined" />

              <TextField
                margin="normal"
                label="First Name"
                type="text"
                fullWidth
                className={'field_FirstName'}
                variant="outlined"
                value={Usersdata.FirstName || ''}
                onChange={handleUsersChange('FirstName')}
                error={usersData?.errField === 'FirstName'}
                helperText={usersData?.errField === 'FirstName' && usersData.errMessage}
              />

              <TextField
                margin="normal"
                label="Last Name"
                type="text"
                fullWidth
                className={'field_LastName'}
                variant="outlined"
                value={Usersdata.LastName || ''}
                onChange={handleUsersChange('LastName')}
                error={usersData?.errField === 'LastName'}
                helperText={usersData?.errField === 'LastName' && usersData.errMessage}
              />

              <TextField
                margin="normal"
                label="Email"
                type="text"
                fullWidth
                className={'field_Email'}
                variant="outlined"
                value={Usersdata.Email || ''}
                onChange={handleUsersChange('Email')}
                error={usersData?.errField === 'Email'}
                helperText={usersData?.errField === 'Email' && usersData.errMessage}
              />

              <TextField
                margin="normal"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={Usersdata.Password}
                onChange={handleUsersChange('Password')}
                error={usersData?.errField === 'Password'}
                helperText={usersData?.errField === 'Password' && usersData.errMessage}
              />

              <Button variant="contained" color="primary" onClickCapture={handleRegister}>
                Register
              </Button>
            </div>
          </Container>
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default Register
