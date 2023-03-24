import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AppBar from '@mui/material/AppBar'
import green from '@mui/material/colors/green'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import thememodulescss from 'dist/css/theme.module.scss'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Autocomplete from '../components/Autocomplete'
import AddDialog from '../components/Dialog/Dialog'
import FileUpload from '../components/FileUpload/FileUpload'
import Sidebar from '../components/Sidebar/Sidebar'
import Field from '../components/Table/Field'
import Table from '../components/Table/Table'
import { addEventos, editEventos, loadEventos, removeEvento, searchEventos } from '../store/actions/eventosActions'
import { IEventosItem } from '../store/models'
import { IState } from '../store/reducers/index'

const aptugotheme = createTheme({
  palette: {
    primary: green,
  },
})

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const Eventos: FunctionComponent = (props: any) => {
  const {
    history: navigation,
    match: { params },
  } = props
  const classes = baseClasses
  const initialDataEventos = {
    Nombre: '',
    Fecha: '',
    Hora: '',
    Imagen: '',
    NombreLugar: null,
  }
  const [Eventosdata, setEventosData] = React.useState<any>(initialDataEventos)
  const handleEventosChange = (name: string) => (event: any) => {
    const value = event?.target ? (event.target.files ? event.target.files[0] : event.currentTarget?.value || event.target.value) : event
    setEventosData({
      ...Eventosdata,
      [name]: value,
    })
  }
  const eventosData = useSelector((state: IState) => state.eventos)
  const theme = thememodulescss
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const dispatch = useDispatch()
  let searchTimeout = null
  const searchForEventos = (event, field = null) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      settableloadoptions({
        ...tableloadoptions,
        searchString: event.target.value,
        searchField: field,
      })
    }, 500)
  }
  const [searchFieldloadoptions, setsearchFieldloadoptions] = React.useState<any>({
    page: 1,
    populate: true,
    limit: 25,
    sort: { field: null, method: 'DESC' },
    totalItems: 0,
  })
  const performsearchFieldload = (options) => {
    dispatch(options.searchString ? searchEventos(options) : loadEventos(options))
  }
  React.useEffect(() => {
    performsearchFieldload({
      ...searchFieldloadoptions,
    })
  }, [searchFieldloadoptions])
  const [dialogEventosAction, setdialogEventosAction] = React.useState<'add' | 'edit' | 'delete' | ''>('')
  const LocalAddDialog = AddDialog

  const usersAutocompleteData = useSelector((state: IState) => state.users)
  const [NombreLugarOptions, setNombreLugarOptions] = React.useState<{ label: String; value: String }[]>([])
  const typeInSearchNombreLugarUsers = (typedIn) => {
    const searchOptions = { searchString: typedIn, searchField: 'Lugar', page: 1, limit: 25 }
    axios.get('http://127.0.0.1:4567/api/users/search/', { params: searchOptions }).then((result) => {
      setNombreLugarOptions(
        result.data.docs.map((usersrecord) => {
          return { label: usersrecord.Lugar, value: usersrecord._id }
        })
      )
    })
  }
  const [NombreLugarValue, setNombreLugarValue] = React.useState(null)
  React.useEffect(() => {
    if (!Eventosdata.NombreLugar) return undefined
    const asArray = Array.isArray(Eventosdata.NombreLugar) ? Eventosdata.NombreLugar : [Eventosdata.NombreLugar]
    setNombreLugarValue(asArray.map((item) => ({ label: item.Lugar, value: item._id })))
  }, [Eventosdata.NombreLugar])
  const [tableloadoptions, settableloadoptions] = React.useState<any>({
    page: 1,
    populate: true,
    limit: 25,
    sort: { field: null, method: 'DESC' },
    totalItems: 0,
  })
  const performtableload = (options) => {
    dispatch(options.searchString ? searchEventos(options) : loadEventos(options))
  }
  React.useEffect(() => {
    performtableload({
      ...tableloadoptions,
    })
  }, [tableloadoptions])

  if (!authHeaders()) {
    props.history.push('/Login')
  }

  // Theme selection

  return (
    <React.Fragment>
      <ThemeProvider theme={aptugotheme}>
        <div className={theme.pages}>
          {currentUser && (
            <React.Fragment>
              <AppBar elevation={3} color="transparent" position="absolute" title="">
                <Toolbar>
                  <IconButton
                    onClick={(event) => {
                      setprofileMenuAnchor(event.currentTarget)
                    }}
                    className={theme.profilePicture}
                  >
                    <picture>
                      <img src={`/img/${currentUser.ProfilePic}`} alt={`/img/${currentUser.ProfilePic}`} />
                    </picture>
                  </IconButton>

                  <Menu
                    anchorEl={profileMenuAnchor}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    open={Boolean(profileMenuAnchor)}
                    onClose={(params) => {
                      setprofileMenuAnchor(null)
                    }}
                  >
                    <div title="div" className={theme.menuProfileDetails}>
                      {currentUser.FirstName} {currentUser.LastName}
                    </div>

                    <MenuItem>Profile</MenuItem>
                    <MenuItem
                      onClick={(params) => {
                        AuthService.logout()
                        props.history.push('/')
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </Toolbar>
              </AppBar>
            </React.Fragment>
          )}

          <Sidebar color="Greens" open={true}>
            <NavLink exact to="/" key="PwMtQTDG">
              <ListItem button className={classes.itemLink}>
                <ListItemText>Home</ListItemText>
              </ListItem>
            </NavLink>

            <NavLink exact to="/Users" key="8SQBot4h">
              <ListItem button className={classes.itemLink}>
                <ListItemText>Users</ListItemText>
              </ListItem>
            </NavLink>

            <NavLink exact to="/Eventos" key="sVk7qg0m">
              <ListItem button className={classes.itemLink}>
                <ListItemText>Eventos</ListItemText>
              </ListItem>
            </NavLink>

            <NavLink exact to="/Zonas" key="T6sC3Ag2">
              <ListItem button className={classes.itemLink}>
                <ListItemText>Zonas</ListItemText>
              </ListItem>
            </NavLink>

            <NavLink exact to="/Tickets" key="H8KZ2Tuy">
              <ListItem button className={classes.itemLink}>
                <ListItemText>Tickets</ListItemText>
              </ListItem>
            </NavLink>
          </Sidebar>
          <div title="div" className={theme.mainarea}>
            <Container maxWidth="lg">
              <div title="Head" className={theme.tableHeading}>
                <Typography variant="h4">Evento list</Typography>
              </div>

              <Paper square>
                <div title="Table Area" className={classes.tableResponsive}>
                  <div title="Table Toolbar" className={theme.tabletoolbar}>
                    <TextField
                      variant="outlined"
                      placeholder="Search Evento..."
                      margin="dense"
                      size="small"
                      className={theme.extensibleInput}
                      type="text"
                      onChange={searchForEventos}
                    />

                    <LocalAddDialog
                      isOpen={dialogEventosAction !== ''}
                      onOpen={() => setdialogEventosAction('add')}
                      onSave={() => setdialogEventosAction('')}
                      onClose={() => setdialogEventosAction('')}
                      action={dialogEventosAction}
                      addOptions={{ title: 'Add Evento', text: 'Enter Evento data', button: 'Add' }}
                      editOptions={{ title: 'Edit Evento', text: 'Update Evento data', button: 'Edit' }}
                      removeOptions={{ title: '', text: '', button: '' }}
                      saveDataHandler={(data: IEventosItem) => {
                        if (dialogEventosAction === 'delete') {
                          dispatch(removeEvento(data))
                        } else {
                          dialogEventosAction === 'add' ? dispatch(addEventos(data)) : dispatch(editEventos(data))
                        }
                      }}
                      color="primary"
                      data={Eventosdata}
                      initialData={initialDataEventos}
                      setData={setEventosData}
                      allowMultipleSubmit={dialogEventosAction === 'add'}
                    >
                      <TextField
                        margin="dense"
                        label="Nombre"
                        type="text"
                        fullWidth
                        className={'field_Nombre'}
                        variant="standard"
                        value={Eventosdata.Nombre || ''}
                        onChange={handleEventosChange('Nombre')}
                        error={eventosData?.errField === 'Nombre'}
                        helperText={eventosData?.errField === 'Nombre' && eventosData.errMessage}
                      />

                      <TextField
                        className={'field_Fecha'}
                        margin="dense"
                        label="Fecha"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={Eventosdata.Fecha?.slice(0, 10) || ''}
                        onChange={handleEventosChange('Fecha')}
                        error={eventosData?.errField === 'Fecha'}
                        helperText={eventosData?.errField === 'Fecha' && eventosData.errMessage}
                      />

                      <TextField
                        margin="dense"
                        label="Hora"
                        type="text"
                        fullWidth
                        className={'field_Hora'}
                        variant="standard"
                        value={Eventosdata.Hora || ''}
                        onChange={handleEventosChange('Hora')}
                        error={eventosData?.errField === 'Hora'}
                        helperText={eventosData?.errField === 'Hora' && eventosData.errMessage}
                      />

                      <FileUpload label="Imagen" value={Eventosdata.Imagen} onChange={handleEventosChange('Imagen')} variant="standard" />

                      <Autocomplete
                        value={NombreLugarValue}
                        onType={typeInSearchNombreLugarUsers}
                        onChange={(newValue) =>
                          handleEventosChange('NombreLugar')(
                            newValue?.length ? newValue.map((item) => ({ _id: item.value !== 'new' ? item.value : null, Lugar: item.label })) : []
                          )
                        }
                        loading={usersAutocompleteData.loadingStatus === 'loading'}
                        options={NombreLugarOptions}
                        label="NombreLugar"
                        fullWidth
                        variant="standard"
                        margin="dense"
                      />
                    </LocalAddDialog>
                  </div>

                  <div title="Body">
                    <Table
                      tableHead={['Nombre', 'Fecha', 'Hora', 'Imagen', 'NombreLugar', 'Actions']}
                      tableData={eventosData.foundeventos.length ? eventosData.foundeventos : (eventosData.eventos as any)}
                      orderBy={tableloadoptions.sort.field}
                      order={tableloadoptions.sort.method}
                      onRequestSort={(event, property) => {
                        settableloadoptions({
                          ...tableloadoptions,
                          sort: {
                            field: property,
                            method: tableloadoptions.sort.field === property ? (tableloadoptions.sort.method === 'asc' ? 'desc' : 'asc') : 'ASC',
                          },
                        })
                      }}
                    >
                      <Field value={(fieldData: any) => fieldData.Nombre} />

                      <Field value={(fieldData: any) => moment(fieldData.Fecha).utc().format('MM/DD/YYYY HH:mm')} />

                      <Field value={(fieldData: any) => fieldData.Hora} />

                      <Field value={(fieldData: any) => (fieldData.Imagen ? <img src={`/img/${fieldData.Imagen}`} /> : <div />)} />

                      <Field value={(fieldData: any) => (fieldData.NombreLugar ? fieldData.NombreLugar.Lugar : '')} />
                      <div className={classes.actionsArea}>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClickCapture={(e: any) => {
                            setEventosData(e.element)
                            setdialogEventosAction('edit')
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClickCapture={(e: any) => {
                            dispatch(removeEvento(e.element))
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </Table>
                  </div>
                </div>
              </Paper>
            </Container>
          </div>
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default Eventos
