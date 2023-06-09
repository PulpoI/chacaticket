import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import thememodulescss from 'dist/css/theme.module.scss'

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const Dashboard: FunctionComponent = (props: any) => {
  const {
    history: navigation,
    match: { params },
  } = props
  const classes = baseClasses
  const theme = thememodulescss
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  React.useEffect(() => {
    if (currentUser) {
      window.location.href = '/mis-eventos'
    }
  }, [])

  return (
    <React.Fragment>
      <div className={theme.pages}></div>
    </React.Fragment>
  )
}

export default Dashboard
