import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import { Logout } from '@mui/icons-material'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import thememodulescss from 'dist/css/theme.module.scss'
import { NavLink } from 'react-router-dom'

import moment from 'moment'
import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const CrearEvento: FunctionComponent = (props: any) => {
  const {
    history: navigation,
    match: { params },
  } = props
  const classes = baseClasses
  const theme = thememodulescss
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const [imagenEvento, setimagenEvento] = React.useState<any>([])
  const [horaEvento, sethoraEvento] = React.useState<any>('21:00')
  const [fechaEvento, setfechaEvento] = React.useState<any>(new Date())
  const [nombreEvento, setnombreEvento] = React.useState<any>('')

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  const crearEvento = async () => {
    const data = new FormData()
    data.append('Nombre', nombreEvento)
    data.append('Fecha', fechaEvento)
    data.append('Hora', horaEvento)
    data.append('Imagen', imagenEvento[0])
    data.append('NombreLugar', currentUser._id)
    await axios.post('http://localhost:4567/api/Eventos', data).then((response) => {
      console.log(response.data)
    })
  }
  //para mostrar hora
  // console.log(moment((horaEvento)).format("hh:mm A"))

  React.useEffect(() => {
    if (currentUser?._id) {
      axios.get('`http://localhost:4567/api/Eventos/`').then((result) => {})
    }
  }, [currentUser])

  return (
    <React.Fragment>
      <div className={classes.mainPanel}>
        <AppBar elevation={0} color="primary" position="sticky" title="Navbar">
          <Toolbar>
            <div title="Nav Bar" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}>
              <div title="Logo">
                <picture>
                  <img src="/img/PngItem_467799.png" alt="/img/PngItem_467799.png" width="100" height="100" />
                </picture>
              </div>

              <div title="Nav Links" style={{ display: 'flex' }}>
                <NavLink exact to="/mis-eventos" key="imit0EVR">
                  <ListItem button className={classes.itemLink}>
                    <ListItemText>Mis eventos</ListItemText>
                  </ListItem>
                </NavLink>

                <NavLink exact to="/crear-evento" key="dqn1IUCR">
                  <ListItem button className={classes.itemLink}>
                    <ListItemText>Crear evento</ListItemText>
                  </ListItem>
                </NavLink>
              </div>

              <div title="Logout">
                <Button
                  color="primary"
                  onClickCapture={(e) => {
                    doLogout()
                  }}
                >
                  <Logout
                    color="error"
                    sx={{
                      fontSize: 30,
                    }}
                  />
                </Button>
              </div>
            </div>
          </Toolbar>
        </AppBar>

        <div title="Container">
          <div title="Imagen de Evento">
            {
              <input
                type="file"
                name="files"
                multiple
                onChange={(e) => {
                  setimagenEvento(e.target.files)
                }}
              />
            }
          </div>

          <div title="Fecha y Hora">
            <TextField
              variant="standard"
              label="Fecha del Evento"
              type="date"
              value={moment(fechaEvento).format('yyyy-MM-DD')}
              onChange={(e) => {
                setfechaEvento(e.target.value)
              }}
            />

            <div title="Horario">
              {<TextField label="Editar Fecha de Evento" type="time" value={horaEvento} onChange={(e) => sethoraEvento(e.target.value)} />}
            </div>
          </div>

          <div title="Nombre de Evento">
            <TextField
              variant="standard"
              label="Nombre del Evento"
              type="text"
              value={nombreEvento}
              onChange={(e) => {
                setnombreEvento(e.target.value)
              }}
            />
          </div>

          <Button
            color="primary"
            onClickCapture={(e) => {
              crearEvento()
            }}
          >
            Crear
          </Button>
        </div>
      </div>

      <div title="Footer" style={{ paddingBlock: '3rem', backgroundColor: 'black', color: 'white' }}>
        <div title="div" style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6">Copyright CHACATICKET</Typography>
        </div>
      </div>
    </React.Fragment>
  )
}

export default CrearEvento
