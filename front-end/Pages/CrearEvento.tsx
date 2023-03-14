import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

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
  const [fechaEvento, setfechaEvento] = React.useState<any>(new Date())
  const [nombreEvento, setnombreEvento] = React.useState<any>('')

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  React.useEffect(() => {
    if (currentUser?._id) {
      axios.post(`http://localhost:4567/api/Eventos/`).then((result) => {})
    }
  }, [currentUser])

  return (
    <React.Fragment>
      <div className={classes.mainPanel}>
        <div title="div">
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

        <div title="Fecha y Hora">
          <TextField
            variant="standard"
            label="Editar Fecha de Evento"
            type="date"
            value={moment(fechaEvento).format('yyyy-MM-DD')}
            onChange={(e) => {
              setfechaEvento(e.target.value)
            }}
          />

          <TextField variant="standard" type="text" />
        </div>
      </div>
    </React.Fragment>
  )
}

export default CrearEvento
