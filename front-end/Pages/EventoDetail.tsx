import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import minimum from '../components/Themes/minimum.module.scss'

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const DetallesdeEvento: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const [lang, setlang] = React.useState<any>('en')
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const [fechaDeEvento, setfechaDeEvento] = React.useState<any>('')
  const [nombreDeEvento, setnombreDeEvento] = React.useState<any>('')

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  React.useEffect(() => {
    if (typeof langStrings !== 'undefined') {
      setlang(langStrings[localStorage.getItem('aptugolang') || 'en'])
    }
  }, [])

  const guardarEvento = () => {
    let data = ''

    data.Nombre = currentUser._id
  }
  
  

  return (
    <React.Fragment>
      <div className={classes.mainPanel}>
        <Container>
          <div title="div">
            <TextField
              variant="standard"
              label="Editar Nombre de Evento"
              type="text"
              value={nombreDeEvento}
              onChange={(e) => {
                setnombreDeEvento(e.target.value)
              }}
            />

            <Button color="primary" onClickCapture={guardarEvento}>
              Guardar Evento
            </Button>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default DetallesdeEvento
