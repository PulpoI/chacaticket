import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import minimum from '../components/Themes/minimum.module.scss'
import { loadEventos, searchEventos } from '../store/actions/eventosActions'
import { addZonas, editZonas } from '../store/actions/zonasActions'
import { IEventosItem } from '../store/models'
import { IState } from '../store/reducers/index'

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const AgregarZona: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const initialDataZonas = {
    Nombre: '',
    Precio: '',
    NombreEvento: null,
  }
  const [Zonasdata, setZonasData] = React.useState<any>(initialDataZonas)
  const handleZonasChange = (name: string) => (event: any) => {
    const value = event?.target ? (event.target.files ? event.target.files[0] : event.currentTarget?.value || event.target.value) : event
    setZonasData({
      ...Zonasdata,
      [name]: value,
    })
  }
  const [lang, setlang] = React.useState<any>('en')
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const evento = useSelector((state: IState): IEventosItem => state.eventos).eventos[0] || {}
  const eventosData = useSelector((state: IState) => state.eventos)
  const dispatch = useDispatch()
  const [LoadfromDatabaseloadoptions, setLoadfromDatabaseloadoptions] = React.useState<any>({
    page: 1,
    populate: true,
    limit: 25,
    sort: { field: null, method: 'DESC' },
    totalItems: 0,
  })
  const performLoadfromDatabaseload = (options) => {
    dispatch(options.searchString ? searchEventos(options) : loadEventos(options))
  }
  React.useEffect(() => {
    performLoadfromDatabaseload({
      ...LoadfromDatabaseloadoptions,
    })
  }, [LoadfromDatabaseloadoptions])

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  React.useEffect(() => {
    if (typeof langStrings !== 'undefined') {
      setlang(langStrings[localStorage.getItem('aptugolang') || 'en'])
    }
  }, [])

  let zonasData = Zonasdata

  React.useEffect(() => {
    if (eventosData.loadingStatus === 'loaded') {
      console.log(evento.nombre)
    }
  }, [eventosData.loadingStatus])

  const crearZona = () => {
    let data = {}

    data.Nombre = 'PEPE'

    data.Precio = '2000'

    data.NombreEvento = 'hola'

    if (data._id) {
      dispatch(editZonas(data as any))
    } else {
      dispatch(addZonas(data as any))
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
              <div title="Crear Zona/s" style={{ paddingRight: 100, paddingLeft: 100, paddingBlock: 100 }}>
                <div title="div" style={{ marginTop: 20 }}>
                  Agregar Zona/s
                </div>

                <div title="div">
                  <TextField
                    margin="normal"
                    label="Nombre"
                    type="text"
                    fullWidth
                    className={'field_Nombre'}
                    variant="standard"
                    value={Zonasdata.Nombre || ''}
                    onChange={handleZonasChange('Nombre')}
                    error={zonasData?.errField === 'Nombre'}
                    helperText={zonasData?.errField === 'Nombre' && zonasData.errMessage}
                  />

                  <TextField
                    margin="normal"
                    label="Precio"
                    className={'field_Precio'}
                    type="number"
                    fullWidth
                    variant="standard"
                    value={Zonasdata.Precio || ''}
                    onChange={handleZonasChange('Precio')}
                  />
                </div>

                <div title="Boton Crear Zona" style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button color="primary" onClickCapture={crearZona}>
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

export default AgregarZona
