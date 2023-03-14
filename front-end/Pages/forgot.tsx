import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import Typography from '@mui/material/Typography'
import axios from 'axios'
import _server from 'react-dom/server'
import { NavLink } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import blue from '@mui/material/colors/blue'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { useDispatch } from 'react-redux'
import minimum from '../components/Themes/minimum.module.scss'
import { mergeClasses } from '../services/utils'
import { addUsers, editUsers } from '../store/actions/usersActions'

const aptugotheme = createTheme({
  palette: {
    primary: blue,
  },
})

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

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
const RetrievePassword: FunctionComponent = (props: any) => {
  const classes = mergeClasses(baseClasses, localStyles)
  const theme = minimum
  const [userData, setuserData] = React.useState<any>({ _id: null, Password: '' })
  const [recoverSuccess, setrecoverSuccess] = React.useState<any>(null)
  const [recoverError, setrecoverError] = React.useState<any>(null)
  const [userEmail, setuserEmail] = React.useState<any>('')
  const recoverPasswordFormat = (to, extra: any = {}) => {
    const from = extra.from || ''
    const subject = extra.subject || 'Recover Password'
    const messageHtml = InlineLink()
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:4567/api/sendEmail',
      data: {
        name: from,
        email: to,
        messageHtml: messageHtml,
        extra: extra,
        subject: subject,
      },
    }).then((response) => {
      if (response.data.msg === 'success') {
        console.log('Email sent, awesome!')
      } else if (response.data.msg === 'fail') {
        console.log('error', response)
      }
    })
  }
  function InlineLink(emailParameters: any = {}) {
    var _server2 = _interopRequireDefault(_server)
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    function renderEmail(emailComponent) {
      var doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
      return `${doctype}${_server2.default.renderToStaticMarkup(emailComponent).replaceAll('/img/', 'https://chacaticketlite.aptugo.com/img/')}`
    }

    return (
      emailParameters.content ||
      renderEmail(
        <div>
          <div title="div">
            <Typography variant="h2">Password reset?</Typography>
            If you requested a password reset, use the link below to complete the process. If you didn't make this request, ignore this email.
            <div title="div">
              <a href="/forgot/**nonce**/**email**">Click here to reset your password</a>
            </div>
          </div>
        </div>
      )
    )
  }
  const dispatch = useDispatch()

  // Theme selection

  const sendNonce = () => {
    setrecoverSuccess(null)
    setrecoverError(null)
    AuthService.recoverPassword({ email: userEmail, subject: 'Password recovery', message: InlineLink(), name: 'pedro corica' }).then(
      (res) => {
        setrecoverSuccess(`Email sent to ${userEmail}`)
      },
      (error) => {
        setrecoverError(error.response.data.message)
      }
    )
  }

  const saveNewPassword = () => {
    const data = { ...userData }

    if (data._id) {
      dispatch(editUsers(data as any))
    } else {
      dispatch(addUsers(data as any))
    }
  }

  React.useEffect(() => {
    if (props.match.params.nonce) {
      AuthService.checkNonce(props.match.params.nonce, props.match.params.email).then(
        (res) => {
          authHeaders()
          setuserData({ ...userData, _id: res })
        },
        (error) => {
          console.error(error)
        }
      )
    }
  }, [props.match.params.nonce])

  return (
    <React.Fragment>
      <ThemeProvider theme={aptugotheme}>
        <div className={theme.retrieveBody}>
          <Container className={theme.loginPage} maxWidth="md">
            {!props.match.params.nonce && (
              <React.Fragment>
                <div title="div" className={theme.regulatedWidth}>
                  <Typography variant="h3">Forgot your password?</Typography>

                  <Typography variant="body1">
                    Please enter the email address associated with your account and we will email you a link to reset your password
                  </Typography>

                  {recoverSuccess && (
                    <React.Fragment>
                      <Alert variant="standard" severity="success">
                        {recoverSuccess}
                      </Alert>
                    </React.Fragment>
                  )}

                  {recoverError && (
                    <React.Fragment>
                      <Alert variant="standard" severity="error">
                        {recoverError}
                      </Alert>
                    </React.Fragment>
                  )}

                  <TextField
                    variant="outlined"
                    margin="normal"
                    label="Email address"
                    type="text"
                    value={userEmail}
                    onChange={(e) => {
                      setuserEmail(e.target.value)
                    }}
                  />

                  <Button variant="contained" color="primary" onClickCapture={sendNonce}>
                    Reset Password
                  </Button>
                  <div title="div">
                    Go back to&nbsp;
                    <NavLink to="/Login" key="WBLTseJy">
                      Login
                    </NavLink>
                  </div>
                </div>
              </React.Fragment>
            )}

            {props.match.params.nonce && (
              <React.Fragment>
                <div title="div" className={theme.regulatedWidth}>
                  <Typography variant="h3">Reset your Password</Typography>

                  <Typography variant="body1">Set your new password in the field below</Typography>

                  <TextField
                    variant="outlined"
                    margin="normal"
                    label="New Password"
                    type="password"
                    value={userData.Password}
                    onChange={(e) => {
                      setuserData({ ...userData, Password: e.target.value })
                    }}
                  />

                  <Button variant="contained" color="primary" onClickCapture={saveNewPassword}>
                    Reset Password!
                  </Button>
                </div>
              </React.Fragment>
            )}
          </Container>
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default RetrievePassword
