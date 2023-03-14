import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import { useDispatch } from 'react-redux'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import minimum from '../components/Themes/minimum.module.scss'
import { addEventos, editEventos } from '../store/actions/eventosActions'

const CrearEvento: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const initialDataEventos = {
    nombre: '',
    fecha: '',
    imagen: '',
  }
  const [Eventosdata, setEventosData] = React.useState<any>(initialDataEventos)
  const handleEventosChange = (name: string) => (event: any) => {
    const value = event?.target ? (event.target.files ? event.target.files[0] : event.currentTarget?.value || event.target.value) : event
    setEventosData({
      ...Eventosdata,
      [name]: value,
    })
  }
  const [lang, setlang] = React.useState<any>('en')
  const theme = minimum
  const [eventoIsCreated, seteventoIsCreated] = React.useState<any>({})
  const dispatch = useDispatch()

  // Theme selection

  React.useEffect(() => {
    if (typeof langStrings !== 'undefined') {
      setlang(langStrings[localStorage.getItem('aptugolang') || 'en'])
    }
  }, [])

  let eventosData = Eventosdata

  const crearEvento = () => {
    let data = {}

    data.nombre = Eventosdata.nombre

    data.fecha = Eventosdata.fecha

    if (data._id) {
      dispatch(editEventos(data as any))
    } else {
      dispatch(addEventos(data as any))
    }
  }

  return (
    <React.Fragment>
      <div className={classes.mainPanel}>
        <Container maxWidth="md" sx={{ marginTop: 10 }}>
          <Swiper
            slidesPerView={1}
            spaceBetween={5}
            slidesPerGroup={1}
            loop={true}
            navigation={true}
            loopFillGroupWithBlank={true}
            pagination={{ clickable: true }}
            modules={[Pagination, Navigation]}
          >
            <SwiperSlide>
              <div title="Crear Evento" style={{ paddingRight: 100, paddingLeft: 100, paddingBlock: 100 }}>
                <div title="div" style={{ marginTop: 20 }}>
                  Crear evento
                </div>

                <div title="div">
                  <TextField
                    margin="dense"
                    label="nombre"
                    type="text"
                    fullWidth
                    className={'field_nombre'}
                    variant="standard"
                    value={Eventosdata.nombre || ''}
                    onChange={handleEventosChange('nombre')}
                    error={eventosData?.errField === 'nombre'}
                    helperText={eventosData?.errField === 'nombre' && eventosData.errMessage}
                  />

                  <TextField
                    label="fecha"
                    type="datetime-local"
                    fullWidth
                    step="900"
                    value={
                      Eventosdata.fecha
                        ? new Date(new Date(Eventosdata.fecha).setMinutes(new Date(Eventosdata.fecha).getMinutes() - new Date().getTimezoneOffset()))
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
                    onChange={handleEventosChange('fecha')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div title="Boton Crear Evento" style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button color="primary" onClickCapture={crearEvento}>
                    CREAR
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CrearEvento
