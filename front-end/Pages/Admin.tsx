import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import { NavLink } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import minimum from '../components/Themes/minimum.module.scss'

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const AdminDashboard: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  return (
    <React.Fragment>
      <div className={classes.mainPanel}>
        {currentUser && (
          <React.Fragment>
            <AppBar elevation={3} color="transparent" position="absolute" title="">
              <Toolbar>
                <IconButton
                  color=""
                  onClick={(event) => {
                    setprofileMenuAnchor(event.currentTarget)
                  }}
                  className={theme.profilePicture}
                >
                  <picture>
                    <img src={`/img/${currentUser.ProfilePic}`} alt={`/img/${currentUser.ProfilePic}`} />
                  </picture>
                </IconButton>

                <Menu
                  anchorEl={profileMenuAnchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  open={Boolean(profileMenuAnchor)}
                  onClose={(params) => {
                    setprofileMenuAnchor(null)
                  }}
                >
                  <div title="div" className={theme.menuProfileDetails}>
                    {currentUser.FirstName} {currentUser.LastName}
                  </div>

                  <MenuItem>Profile</MenuItem>
                  <MenuItem
                    onClick={(params) => {
                      AuthService.logout()
                      props.history.push('/')
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </Toolbar>
            </AppBar>
          </React.Fragment>
        )}

        <Sidebar color="Greens" open={true}>
          <NavLink exact to="/" key="PwMtQTDG">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Home</ListItemText>
            </ListItem>
          </NavLink>

          <NavLink exact to="/Users" key="8SQBot4h">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Users</ListItemText>
            </ListItem>
          </NavLink>

          <NavLink exact to="/Eventos" key="sVk7qg0m">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Eventos</ListItemText>
            </ListItem>
          </NavLink>

          <NavLink exact to="/Zonas" key="T6sC3Ag2">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Zonas</ListItemText>
            </ListItem>
          </NavLink>

          <NavLink exact to="/Ubicaciones" key="O1dAlMUs">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Ubicaciones</ListItemText>
            </ListItem>
          </NavLink>

          <NavLink exact to="/Tickets" key="H8KZ2Tuy">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Tickets</ListItemText>
            </ListItem>
          </NavLink>
        </Sidebar>
      </div>
    </React.Fragment>
  )
}

export default AdminDashboard
