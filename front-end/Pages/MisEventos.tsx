import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import DeleteIcon from '@mui/icons-material/Delete'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import minimum from '../components/Themes/minimum.module.scss'

import moment from 'moment'
import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const MisEventos: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const [lang, setlang] = React.useState<any>('en')
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const [misEventos, setmisEventos] = React.useState<any>([])

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  React.useEffect(() => {
    if (typeof langStrings !== 'undefined') {
      setlang(langStrings[localStorage.getItem('aptugolang') || 'en'])
    }
  }, [])

  const doLogout = () => {
    AuthService.logout()

    window.location.href = '/login'
  }

  React.useEffect(() => {
    if (currentUser?._id) {
      traerListaDeEventos()
    }
  }, [currentUser])

  const traerListaDeEventos = () => {
    axios.get('http://localhost:4567/api/Eventos').then((result) => {
      setmisEventos(
        result.data.docs.filter((doc) => {
          let eventosFiltrados = doc.NombreLugar.Email === currentUser.Email
          return eventosFiltrados
        })
      )
    })
  }

  return (
    <React.Fragment>
      <div className={classes.mainPanel}>
        <Container>
          <div title="NavBar">
            <NavLink to="/">
              <div title="div">
                <IconButton color="primary">
                  <HomeIcon
                    sx={{
                      fontSize: '24px',
                    }}
                  />
                </IconButton>
              </div>
            </NavLink>

            <NavLink to="/mis-eventos">
              <div title="div">
                <IconButton color="default">
                  <SettingsIcon
                    sx={{
                      fontSize: '24px',
                    }}
                  />
                </IconButton>
              </div>
            </NavLink>

            <div title="div">
              <IconButton
                color="default"
                onClick={(e) => {
                  doLogout()
                }}
              >
                <DeleteIcon
                  sx={{
                    fontSize: '24px',
                  }}
                />
              </IconButton>
            </div>
          </div>

          <div title="Lista de Eventos">
            {misEventos.map((evento, index) => {
              return (
                <React.Fragment key={index}>
                  <a href={`/evento/${evento._id}`}>
                    <Card sx={{ height: 'fit-content', maxWidth: '300px' }}>
                      <CardHeader title={evento.Nombre} subheader={evento.NombreLugar.Lugar}></CardHeader>

                      <CardContent>
                        <picture>
                          <img src={`/img/${evento.Imagen}`} alt={`/img/${evento.Imagen}`} width="270" height="270" />
                        </picture>

                        <div title="Fecha y Hora">{moment(evento.Fecha).format('DD-MM-yyyy')}</div>

                        <div title="Lugar de Evento">
                          {evento.NombreLugar.Lugar}

                          <picture>
                            <img src={`/img/${evento.NombreLugar.ProfilePic}`} alt={`/img/${evento.NombreLugar.ProfilePic}`} width="30" height="30" />
                          </picture>
                        </div>
                      </CardContent>

                      <CardActions></CardActions>
                    </Card>
                  </a>
                </React.Fragment>
              )
            })}
          </div>

          <div title="Footer">Copyright CHACATICKET</div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default MisEventos
