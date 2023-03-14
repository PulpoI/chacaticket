import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { NavLink } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import minimum from '../components/Themes/minimum.module.scss'

const Evento: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const [lang, setlang] = React.useState<any>('en')
  const theme = minimum

  // Theme selection

  React.useEffect(() => {
    if (typeof langStrings !== 'undefined') {
      setlang(langStrings[localStorage.getItem('aptugolang') || 'en'])
    }
  }, [])

  console.log(eventoSeleccionado)
  return (
    <React.Fragment>
      <div className={classes.mainPanel}>
        <Sidebar color="Greens" open={true}>
          <NavLink exact to="/" key="RqH985xF">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Home</ListItemText>
            </ListItem>
          </NavLink>

          <NavLink exact to="/evento" key="00xT5EXx">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Evento</ListItemText>
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

          <NavLink exact to="/Asientos" key="O1dAlMUs">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Asientos</ListItemText>
            </ListItem>
          </NavLink>

          <NavLink exact to="/Tickets" key="H8KZ2Tuy">
            <ListItem button className={classes.itemLink}>
              <ListItemText>Tickets</ListItemText>
            </ListItem>
          </NavLink>
        </Sidebar>
        {eventoSeleccionado}
      </div>
    </React.Fragment>
  )
}

export default Evento
