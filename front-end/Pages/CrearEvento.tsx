import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import minimum from '../components/Themes/minimum.module.scss'

import moment from 'moment'
import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const CrearEvento: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const [imagenEvento, setimagenEvento] = React.useState<any>([])
  const [imagenes, setimagenes] = React.useState<any>('')
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
      axios.get(`http://localhost:4567/api/Eventos/`).then((result) => {})
    }
  }, [currentUser])

  return (
    <React.Fragment>
      <div className={classes.mainPanel}>
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

        <Button
          color="primary"
          onClickCapture={(e) => {
            crearEvento()
          }}
        >
          Crear
        </Button>
      </div>
    </React.Fragment>
  )
}

export default CrearEvento
