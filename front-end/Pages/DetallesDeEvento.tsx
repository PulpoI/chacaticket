import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import { Edit, Logout } from '@mui/icons-material'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import thememodulescss from 'dist/css/theme.module.scss'
import Moment from 'react-moment'
import { NavLink } from 'react-router-dom'

import axios from 'axios'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const DetallesdeEvento: FunctionComponent = (props: any) => {
  const {
    history: navigation,
    match: { params },
  } = props
  const classes = baseClasses
  const theme = thememodulescss
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const [ticketsZona, setticketsZona] = React.useState<any>(0)
  const [precioZona, setprecioZona] = React.useState<any>('')
  const [nombreZona, setnombreZona] = React.useState<any>('')
  const [editarT, seteditarT] = React.useState<any>('')
  const [editar, seteditar] = React.useState<any>('')
  const [nuevaCantidadTickets, setnuevaCantidadTickets] = React.useState<any>('')
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
  const [user, setuser] = React.useState<any>('')
  const [loader, setloader] = React.useState<any>(true)

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  currentUser.then(function (user) {
    setuser(user)
  })
  const { eventoId } = useParams()

  React.useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:4567/api/Eventos/${eventoId}`)
        .then((result) => {
          setevento(result.data.docs[0])
          setnombreLugar(result.data.docs[0].NombreLugar)
          setfecha(result.data.docs[0].Fecha)
          setnuevaFechaEvento(result.data.docs[0].Fecha)
          sethora(result.data.docs[0].Hora)
          setzonas(result.data.docs[0].Zonas)
        })
        .finally(() => {
          setTimeout(() => {
            setloader(false)
          }, 400)
        })
    }
  }, [user])

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

  const editarTickets = async (zonaId) => {
    let zonaTemp = []
    await axios.get(`http://localhost:4567/api/Zonas/${zonaId}`).then((result) => {
      zonaTemp = result.data.docs[0].Tickets
      zonaTemp.map((ticket) => {
        if (ticket.NombreZona === zonaId) {
          axios.delete(`http://localhost:4567/api/Tickets/${ticket._id}`)
        }
      })
    })
    let cantidad = nuevaCantidadTickets
    while (cantidad !== 0) {
      await axios.post(`http://localhost:4567/api/Tickets`, {
        NombreUbicacion: cantidad,
        NombreZona: zonaId,
        FechaPago: '',
        Usado: false,
      })
      cantidad -= 1
    }
    await axios.get(`http://localhost:4567/api/Eventos/${eventoId}`).then((result) => {
      setzonas(result.data.docs[0].Zonas)
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
        Usado: false,
      })
      cantidad -= 1
    }
    await axios.get(`http://localhost:4567/api/Eventos/${eventoId}`).then((result) => {
      setzonas(result.data.docs[0].Zonas)
    })
  }

  const eliminarZona = async (id) => {
    await axios.get(`http://localhost:4567/api/zonas/${id}`).then((result) => {
      let tickets = result.data.docs[0].Tickets
      tickets.map((ticket) => {
        axios.delete(`http://localhost:4567/api/tickets/${ticket._id}`).then((result) => {})
      })
    })
    await axios.delete(`http://localhost:4567/api/zonas/${id}`).then((result) => {})
    await axios.get(`http://localhost:4567/api/Eventos/${eventoId}`).then((result) => {
      setzonas(result.data.docs[0].Zonas)
    })
  }

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

        <div title="Container" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBlock: '3rem', flexWrap: 'wrap' }}>
          {loader && (
            <React.Fragment>
              <div title="Loader" className={theme.lds}></div>
            </React.Fragment>
          )}

          {!loader && (
            <React.Fragment>
              <div title="Card Evento" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div title="Nombre">
                  <div title="div" style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={(e) => {
                        seteditar(evento.Nombre)
                      }}
                    >
                      <Edit color="action" sx={{}} />
                    </IconButton>

                    <Typography variant="h5">{evento.Nombre}</Typography>
                  </div>

                  {editar === evento.Nombre && (
                    <React.Fragment>
                      <div title="div" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                          variant="contained"
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
                </div>

                <div title="Imagen">
                  <div title="div" style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={(e) => {
                        seteditar(evento.Imagen)
                      }}
                    >
                      <Edit color="action" sx={{}} />
                    </IconButton>

                    <picture>
                      <img src={`/img/${evento.Imagen}`} alt={`/img/${evento.Imagen}`} width="270" height="270" />
                    </picture>
                  </div>

                  {editar === evento.Imagen && (
                    <React.Fragment>
                      <div title="div" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <input
                          type="file"
                          name="files"
                          onChange={(e) => {
                            setnuevaImagenEvento(e.target.files)
                          }}
                        />

                        <Button
                          variant="contained"
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
                </div>

                <div title="Fecha">
                  <div title="div" style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={(e) => {
                        seteditar(evento.Fecha)
                      }}
                    >
                      <Edit color="action" sx={{}} />
                    </IconButton>

                    <div title="div">
                      Fecha:
                      <Moment interval={0} format="DD-MM-yyyy" locale="es-AR">
                        {fecha}
                      </Moment>
                    </div>
                  </div>

                  {editar === evento.Fecha && (
                    <React.Fragment>
                      <div title="div" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                          variant="contained"
                          color="primary"
                          onClickCapture={(e) => {
                            guardarFechaEvento()
                          }}
                        >
                          Guardar Fecha
                        </Button>
                      </div>
                    </React.Fragment>
                  )}
                </div>

                <div title="Hora">
                  <div title="div" style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={(e) => {
                        seteditar(evento.Hora)
                      }}
                    >
                      <Edit color="action" sx={{}} />
                    </IconButton>

                    <div title="div">
                      Hora:
                      {hora}
                    </div>
                  </div>

                  {editar === evento.Hora && (
                    <React.Fragment>
                      <div title="div" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {
                          <TextField
                            label="Editar Hora de Evento"
                            type="time"
                            value={nuevaHoraEvento}
                            onChange={(e) => setnuevaHoraEvento(e.target.value)}
                          />
                        }

                        <Button
                          variant="contained"
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
              </div>

              <div title="Zonas Container">
                <div title="Zonas">
                  {zonas.map((zona, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div title="div" style={{ border: 'solid 1px', borderRadius: '30px', padding: '1rem', marginBottom: '1rem' }}>
                          <Typography variant="h5">Zona: {zona.Nombre}</Typography>

                          <Typography variant="h5">Precio: ${zona.Precio}</Typography>

                          {zona.Tickets.length > 0 && (
                            <React.Fragment>
                              <Typography variant="h5">Tickets: {zona.Tickets.length}</Typography>

                              <Button
                                color="primary"
                                onClickCapture={(e) => {
                                  seteditar(zona.Precio)
                                }}
                              >
                                Editar Tickets
                              </Button>
                              {editar === zona.Precio && (
                                <React.Fragment>
                                  <TextField
                                    variant="standard"
                                    type="number"
                                    value={nuevaCantidadTickets}
                                    onChange={(e) => {
                                      setnuevaCantidadTickets(e.target.value)
                                    }}
                                  />

                                  <Button
                                    color="primary"
                                    onClickCapture={(e) => {
                                      editarTickets(zona._id)
                                    }}
                                  >
                                    Guardar
                                  </Button>
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          )}

                          {zona.Tickets.length < 1 && (
                            <React.Fragment>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClickCapture={(e) => {
                                  seteditar(zona.Tickets)
                                }}
                              >
                                Agregar Tickets
                              </Button>
                              {editar === zona.Tickets && (
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
                            </React.Fragment>
                          )}

                          <Button
                            variant="contained"
                            color="primary"
                            onClickCapture={(e) => {
                              seteditar(zona._id)
                            }}
                          >
                            Editar Zona
                          </Button>
                          {editar === zona._id && (
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

                          <Button
                            color="inherit"
                            onClickCapture={(e) => {
                              eliminarZona(zona._id)
                            }}
                          >
                            Eliminar Zona
                          </Button>
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>

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
            </React.Fragment>
          )}
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

export default DetallesdeEvento
