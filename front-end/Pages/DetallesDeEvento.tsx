import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
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
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const [ticketsZona, setticketsZona] = React.useState<any>(0)
  const [precioZona, setprecioZona] = React.useState<any>('')
  const [nombreZona, setnombreZona] = React.useState<any>('')
  const [editar, seteditar] = React.useState<any>('')
  const [nuevoPrecioZona, setnuevoPrecioZona] = React.useState<any>('')
  const [nuevoNombreZona, setnuevoNombreZona] = React.useState<any>('')
  const [nuevaHoraEvento, setnuevaHoraEvento] = React.useState<any>('21:00')
  const [nuevaFechaEvento, setnuevaFechaEvento] = React.useState<any>('')
  const [nuevaImagenEvento, setnuevaImagenEvento] = React.useState<any>('')
  const [nuevoNombreEvento, setnuevoNombreEvento] = React.useState<any>('')
  const [zonas, setzonas] = React.useState<any>([])
  const [hora, sethora] = React.useState<any>('')
  const [fecha, setfecha] = React.useState<any>([])
  const [nombreLugar, setnombreLugar] = React.useState<any>([])
  const [evento, setevento] = React.useState<any>([])

  

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  const { eventoId } = useParams()

  React.useEffect(() => {
    if (currentUser?._id) {
      axios.get(`http://localhost:4567/api/Eventos/${eventoId}`).then((result) => {
        setevento(result.data.docs[0])

        setnombreLugar(result.data.docs[0].NombreLugar)

        setfecha(result.data.docs[0].Fecha)

        setnuevaFechaEvento(result.data.docs[0].Fecha)

        sethora(result.data.docs[0].Hora)

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

  const guardarImagenEvento = async () => {
    const data = new FormData()
    data.append('Imagen', nuevaImagenEvento[0])
    await axios.put(`http://localhost:4567/api/Eventos/${eventoId}`, data).then((result) => {
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

  const guardarHoraEvento = () => {
    axios
      .put(`http://localhost:4567/api/Eventos/${eventoId}`, {
        Hora: nuevaHoraEvento,
      })
      .then((result) => {
        sethora(result.data.Hora)
      })
  }

  const guardarNombreZona = (zonaId) => {
    axios
      .put(`http://localhost:4567/api/Zonas/${zonaId}`, {
        Nombre: nuevoNombreZona,
        Precio: nuevoPrecioZona,
      })
      .then((result) => {})

    axios.get(`http://localhost:4567/api/Eventos/${eventoId}`).then((result) => {
      setzonas(result.data.docs[0].Zonas)
      sethora(result.data.docs[0].Hora)
    })
  }

  const crearZona = async () => {
    await axios
      .post(`http://localhost:4567/api/Zonas`, {
        Nombre: nombreZona,
        Precio: precioZona,
        NombreEvento: eventoId,
      })
      .then((response) => {
        console.log(response.data)
      })
    await axios.get(`http://localhost:4567/api/Eventos/${eventoId}`).then((result) => {
      setzonas(result.data.docs[0].Zonas)
    })
  }
  const agregarTickets = async (zonaId) => {
    let cantidad = ticketsZona
    while (cantidad !== 0) {
      await axios.post(`http://localhost:4567/api/Tickets`, {
        NombreUbicacion: cantidad,
        NombreZona: zonaId,
        FechaPago: '',
      })
      cantidad -= 1
    }
    await axios.get(`http://localhost:4567/api/Eventos/${eventoId}`).then((result) => {
      setzonas(result.data.docs[0].Zonas)
    })
  }

  const eliminarZona = async (id) => {
    await axios.delete(`http://localhost:4567/api/zonas/${id}`).then((result) =>
      axios.get(`http://localhost:4567/api/Eventos/${eventoId}`).then((result) => {
        setzonas(result.data.docs[0].Zonas)
      })
    )
  }

  console.log(zonas)
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

                <Button
                  variant="contained"
                  color="primary"
                  onClickCapture={(e) => {
                    seteditar(evento.Imagen)
                  }}
                >
                  Editar Imagen
                </Button>
                {editar === evento.Imagen && (
                  <React.Fragment>
                    <div title="div">
                      <input
                        type="file"
                        name="files"
                        onChange={(e) => {
                          setnuevaImagenEvento(e.target.files)
                        }}
                      />

                      <Button
                        color="primary"
                        onClickCapture={(e) => {
                          guardarImagenEvento()
                        }}
                      >
                        Guardar Imagen
                      </Button>
                    </div>
                  </React.Fragment>
                )}

                <div title="Fecha">
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

                <div title="Hora">
                  {hora}

                  <Button
                    variant="contained"
                    color="primary"
                    onClickCapture={(e) => {
                      seteditar(evento.Hora)
                    }}
                  >
                    Editar Hora
                  </Button>
                  {editar === evento.Hora && (
                    <React.Fragment>
                      <div title="div">
                        {
                          <TextField
                            label="Editar Hora de Evento"
                            type="time"
                            value={nuevaHoraEvento}
                            onChange={(e) => setnuevaHoraEvento(e.target.value)}
                          />
                        }

                        <Button
                          color="primary"
                          onClickCapture={(e) => {
                            guardarHoraEvento()
                          }}
                        >
                          Guardar Hora
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
                  <Typography variant="h5">Zona: {zona.Nombre}</Typography>

                  <Typography variant="h5">Precio: {zona.Precio}</Typography>

                  <List>
                    {zona.Tickets.map((ticket, index) => {
                      return (
                        <React.Fragment key={index}>
                          <ListItemText primary={`Ubicacion: ${ticket.NombreUbicacion}`} />
                        </React.Fragment>
                      )
                    })}
                  </List>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClickCapture={(e) => {
                      seteditar(zona.Nombre)
                    }}
                  >
                    Agregar Ticket
                  </Button>
                  {editar === zona.Nombre && (
                    <React.Fragment>
                      <div title="div">
                        <TextField
                          variant="standard"
                          label="Ingresa la cantidad de Tickets"
                          type="number"
                          value={ticketsZona}
                          onChange={(e) => {
                            setticketsZona(e.target.value)
                          }}
                        />

                        <Button
                          color="primary"
                          onClickCapture={(e) => {
                            agregarTickets(zona._id)
                          }}
                        >
                          Agregar Tickets
                        </Button>
                      </div>
                    </React.Fragment>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClickCapture={(e) => {
                      seteditar(zona.Nombre)
                    }}
                  >
                    Editar Zona
                  </Button>

                  <Button
                    color="primary"
                    onClickCapture={(e) => {
                      eliminarZona(zona._id)
                    }}
                  >
                    Eliminar Zona
                  </Button>
                  {editar === zona.Nombre && (
                    <React.Fragment>
                      <div title="div">
                        <TextField
                          variant="standard"
                          label="Editar Nombre de Zona"
                          type="text"
                          value={index.nuevoNombreZona}
                          onChange={(e) => {
                            setnuevoNombreZona(e.target.value)
                          }}
                        />

                        <TextField
                          variant="standard"
                          label="Editar Precio de Zona"
                          type="number"
                          value={index.nuevoPrecioZona}
                          onChange={(e) => {
                            setnuevoPrecioZona(e.target.value)
                          }}
                        />

                        <Button
                          color="primary"
                          onClickCapture={(e) => {
                            guardarNombreZona(zona._id)
                          }}
                        >
                          Guardar Zona
                        </Button>
                      </div>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )
            })}
            <div title="Agregar Zona">
              <TextField
                variant="standard"
                label="Nombre de la Zona"
                type="text"
                value={nombreZona}
                onChange={(e) => {
                  setnombreZona(e.target.value)
                }}
              />

              <TextField
                variant="standard"
                label="Precio de la Zona"
                type="number"
                value={precioZona}
                onChange={(e) => {
                  setprecioZona(e.target.value)
                }}
              />

              <Button color="primary" onClickCapture={crearZona}>
                Crear Zona
              </Button>
            </div>
          </div>

          <div title="Ubicaciones"></div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default DetallesdeEvento
