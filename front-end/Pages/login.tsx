import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import blue from '@mui/material/colors/blue'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { NavLink } from 'react-router-dom'
import minimum from '../components/Themes/minimum.module.scss'

const aptugotheme = createTheme({
  palette: {
    primary: blue,
  },
})

import AuthService from '../services/auth.service'

const LoginPage: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const theme = minimum
  const [loginError, setloginError] = React.useState<any>(null)
  const [loginData, setloginData] = React.useState<any>({
    Email: '',
    Password: '',
    RememberMe: false,
  })

  // Theme selection

  const handleLogin = () => {
    AuthService.login(loginData.Email, loginData.Password).then(
      (res) => {
        console.log(res)
        props.history.push('/mis-eventos')
      },
      (error) => {
        setloginError(error.response.data.message)
      }
    )
  }

  return (
    <React.Fragment>
      <ThemeProvider theme={aptugotheme}>
        <div className={theme.loginBody}>
          <Container className={theme.loginPage} maxWidth="md">
            <div title="Register Area" className={theme.right}>
              Don't have an account?
              <a href="/Register">Register!</a>
            </div>

            <div title="Login Box" className={theme.loginBox}>
              <div title="Heading" className={theme.headingLogin}>
                <Typography variant="h3">Sign In</Typography>

                <Typography variant="body1">Enter your details below.</Typography>
              </div>

              {loginError && (
                <React.Fragment>
                  <Alert variant="standard" severity="error">
                    {loginError}
                  </Alert>
                </React.Fragment>
              )}

              <TextField
                variant="outlined"
                placeholder="Email Address"
                margin="normal"
                label="Email"
                type="text"
                value={loginData.Email}
                onChange={(e) => {
                  setloginData({ ...loginData, Email: e.target.value })
                }}
              />

              <TextField
                variant="outlined"
                margin="normal"
                label="Password"
                type="password"
                value={loginData.Password}
                onChange={(e) => {
                  setloginData({ ...loginData, Password: e.target.value })
                }}
              />

              <div title="div" className={theme.flexLine}>
                <FormControl margin="dense">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={loginData.RememberMe}
                        onClick={() => {
                          setloginData({ ...loginData, RememberMe: !loginData.RememberMe })
                        }}
                      />
                    }
                    label="Remember me"
                  />
                </FormControl>

                <NavLink to="/forgot">Forgot password?</NavLink>
              </div>

              <Button variant="contained" color="primary" onClickCapture={handleLogin}>
                Login
              </Button>
            </div>
          </Container>
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default LoginPage
