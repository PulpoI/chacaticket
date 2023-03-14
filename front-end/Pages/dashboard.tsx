import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import minimum from '../components/Themes/minimum.module.scss'

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const Dashboard: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const theme = minimum
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
