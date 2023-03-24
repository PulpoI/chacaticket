import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import { Logout } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import thememodulescss from 'dist/css/theme.module.scss'
import { NavLink } from 'react-router-dom'

import moment from 'moment'
import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const MisEventos: FunctionComponent = (props: any) => {
  const {
    history: navigation,
    match: { params },
  } = props
  const classes = baseClasses
  const theme = thememodulescss
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const [loader, setloader] = React.useState<any>(true)
  const [misEventos, setmisEventos] = React.useState<any>([])
  const [user, setuser] = React.useState<any>('')

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  React.useEffect(() => {
    currentUser.then(function (user) {
      setuser(user)
    })
  }, [])

  const doLogout = () => {
    AuthService.logout()
    window.location.href = '/login'
  }

  React.useEffect(() => {
    if (user?._id) {
      fetch('http://localhost:4567/api/Eventos')
        .then((res) => res.json())
        .then((data) =>
          setmisEventos(
            data.docs.filter((doc) => {
              let eventosFiltrados = doc.NombreLugar.Email === user.Email
              return eventosFiltrados
            })
          )
        )
        .finally(() => {
          setloader(false)
        })
    }
  }, [user])

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
          <div title="Main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            {loader && (
              <React.Fragment>
                <div title="Loader" className={theme.lds}></div>
              </React.Fragment>
            )}

            {misEventos.length > 0 && (
              <React.Fragment>
                <Typography variant="h3">Mis eventos</Typography>

                <div title="Container Eventos" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {misEventos.map((evento, index) => {
                    return (
                      <React.Fragment key={index}>
                        <NavLink to={`/evento/${evento._id}`}>
                          <Card sx={{ height: 'fit-content', maxWidth: '300px' }}>
                            <CardHeader title={evento.Nombre} subheader={evento.NombreLugar.Lugar}></CardHeader>

                            <CardContent>
                              <picture>
                                <img src={`/img/${evento.Imagen}`} alt={`/img/${evento.Imagen}`} width="270" height="270" />
                              </picture>

                              <div title="Fecha">Fecha: {moment(evento.Fecha).format('DD-MM-yyyy')}</div>

                              <div title="Hora">Hora: {evento.Hora}</div>

                              <div title="Lugar de Evento">
                                Dirección: {evento.NombreLugar.DireccionLugar}
                                <picture>
                                  <img
                                    src={`/img/${evento.NombreLugar.ProfilePic}`}
                                    alt={`/img/${evento.NombreLugar.ProfilePic}`}
                                    width="40"
                                    height="40"
                                  />
                                </picture>
                              </div>
                            </CardContent>

                            <CardActions></CardActions>
                          </Card>
                        </NavLink>
                      </React.Fragment>
                    )
                  })}
                </div>

                <NavLink to="/crear-evento">
                  <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
                    Crear Nuevo Evento
                  </Button>
                </NavLink>
              </React.Fragment>
            )}

            {misEventos.length < 1 && !loader && (
              <React.Fragment>
                <Typography variant="h3">No tenes eventos creados</Typography>

                <NavLink to="/crear-evento">
                  <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
                    Crear Nuevo Evento
                  </Button>
                </NavLink>
              </React.Fragment>
            )}
          </div>
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

export default MisEventos
