import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import Moment from 'react-moment'
import minimum from '../components/Themes/minimum.module.scss'

import moment from 'moment'
import { useParams } from 'react-router-dom'
import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const DetallesdeEvento: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const [lang, setlang] = React.useState<any>('en')
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const [editar, seteditar] = React.useState<any>('')
  const [nuevoNombreZona, setnuevoNombreZona] = React.useState<any>('')
  const [nuevaFechaEvento, setnuevaFechaEvento] = React.useState<any>('')
  const [nuevoNombreEvento, setnuevoNombreEvento] = React.useState<any>('')
  const [zonas, setzonas] = React.useState<any>([])
  const [fecha, setfecha] = React.useState<any>([])
  const [nombreLugar, setnombreLugar] = React.useState<any>([])
  const [evento, setevento] = React.useState<any>([])

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  React.useEffect(() => {
    if (typeof langStrings !== 'undefined') {
      setlang(langStrings[localStorage.getItem('aptugolang') || 'en'])
    }
  }, [])

  const { eventoId } = useParams()

  React.useEffect(() => {
    if (currentUser?._id) {
      axios.get(`http://localhost:4567/api/Eventos/${eventoId}`).then((result) => {
        setevento(result.data.docs[0])

        setnombreLugar(result.data.docs[0].NombreLugar)

        setfecha(result.data.docs[0].Fecha)

        setnuevaFechaEvento(result.data.docs[0].Fecha)

        setzonas(result.data.docs[0].Zonas)
      })
    }
  }, [currentUser])

  const guardarNombreEvento = () => {
    axios
      .put(`http://localhost:4567/api/Eventos/${eventoId}`, {
        Nombre: nuevoNombreEvento,
      })
      .then((result) => {
        setevento(result.data)
      })
  }

  const guardarFechaEvento = () => {
    axios
      .put(`http://localhost:4567/api/Eventos/${eventoId}`, {
        Fecha: new Date(moment(nuevaFechaEvento).format('MM-DD-yyyy')).toISOString(),
      })
      .then((result) => {
        setfecha(result.data.Fecha)
      })
  }

  const guardarNombreZona = (zonaId) => {
    axios
      .put(`http://localhost:4567/api/Zonas/${zonaId}`, {
        Nombre: nuevoNombreZona,
      })
      .then((result) => {
        setzonas([result.data])
      })
  }

  return (
    <React.Fragment>
      <div className={classes.mainPanel}>
        <Container>
          <div title="Card Evento">
            <Card sx={{ height: 'fit-content', maxWidth: '300px' }}>
              <CardHeader title={evento.Nombre} subheader={nombreLugar.NombreLugar}></CardHeader>

              <Button
                variant="contained"
                color="primary"
                onClickCapture={(e) => {
                  seteditar(evento.Nombre)
                }}
              >
                Editar Nombre
              </Button>
              {editar === evento.Nombre && (
                <React.Fragment>
                  <div title="div">
                    <TextField
                      variant="standard"
                      label="Editar Nombre de Evento"
                      type="text"
                      value={nuevoNombreEvento}
                      onChange={(e) => {
                        setnuevoNombreEvento(e.target.value)
                      }}
                    />

                    <Button
                      color="primary"
                      onClickCapture={(e) => {
                        guardarNombreEvento()
                      }}
                    >
                      Guardar
                    </Button>
                  </div>
                </React.Fragment>
              )}

              <CardContent>
                <picture>
                  <img src={`/img/${evento.Imagen}`} alt={`/img/${evento.Imagen}`} width="270" height="270" />
                </picture>

                <div title="Fecha y Hora">
                  <Moment interval={0} format="DD-MM-yyyy" locale="es-AR">
                    {fecha}
                  </Moment>

                  <Button
                    variant="contained"
                    color="primary"
                    onClickCapture={(e) => {
                      seteditar(evento.Fecha)
                    }}
                  >
                    Editar Fecha
                  </Button>
                  {editar === evento.Fecha && (
                    <React.Fragment>
                      <div title="div">
                        <TextField
                          variant="standard"
                          label="Editar Fecha de Evento"
                          type="date"
                          value={moment(nuevaFechaEvento).format('yyyy-MM-DD')}
                          onChange={(e) => {
                            setnuevaFechaEvento(e.target.value)
                          }}
                        />

                        <Button
                          color="primary"
                          onClickCapture={(e) => {
                            guardarFechaEvento()
                          }}
                        >
                          Guardar
                        </Button>
                      </div>
                    </React.Fragment>
                  )}
                </div>

                <div title="Lugar de Evento">
                  {nombreLugar.NombreLugar}

                  <picture>
                    <img src={`/img/${nombreLugar.ProfilePic}`} alt={`/img/${nombreLugar.ProfilePic}`} width="30" height="30" />
                  </picture>
                </div>
              </CardContent>

              <CardActions></CardActions>
            </Card>
          </div>

          <div title="Zonas">
            {zonas.map((zona, index) => {
              return (
                <React.Fragment key={index}>
                  <Typography variant="h5">
                    Zona: {zona.Nombre}
                    <Button
                      variant="contained"
                      color="primary"
                      onClickCapture={(e) => {
                        seteditar(zona.Nombre)
                      }}
                    >
                      Editar Zona
                    </Button>
                    {editar === zona.Nombre && (
                      <React.Fragment>
                        <div title="div">
                          <Button
                            color="primary"
                            onClickCapture={(e) => {
                              guardarNombreZona(zona._id)
                            }}
                          >
                            Guardar
                          </Button>

                          <TextField
                            variant="standard"
                            label="Editar Nombre de Zona"
                            type="text"
                            value={index.nuevoNombreZona}
                            onChange={(e) => {
                              setnuevoNombreZona(e.target.value)
                            }}
                          />
                        </div>
                      </React.Fragment>
                    )}
                  </Typography>

                  <Typography variant="h5">Precio: {zona.Precio}</Typography>
                </React.Fragment>
              )
            })}
          </div>

          <div title="Ubicaciones"></div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default DetallesdeEvento
