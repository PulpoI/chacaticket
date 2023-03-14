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
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Autocomplete from '../components/Autocomplete'
import AddDialog from '../components/Dialog/Dialog'
import Sidebar from '../components/Sidebar/Sidebar'
import Field from '../components/Table/Field'
import Table from '../components/Table/Table'
import minimum from '../components/Themes/minimum.module.scss'
import { addZonas, editZonas, loadZonas, removeZona, searchZonas } from '../store/actions/zonasActions'
import { IZonasItem } from '../store/models'
import { IState } from '../store/reducers/index'

const aptugotheme = createTheme({
  palette: {
    primary: green,
  },
})

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const Zonas: FunctionComponent = (props: any) => {
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
  const zonasData = useSelector((state: IState) => state.zonas)
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const dispatch = useDispatch()
  let searchTimeout = null
  const searchForZonas = (event, field = null) => {
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
    dispatch(options.searchString ? searchZonas(options) : loadZonas(options))
  }
  React.useEffect(() => {
    performsearchFieldload({
      ...searchFieldloadoptions,
    })
  }, [searchFieldloadoptions])
  const [dialogZonasAction, setdialogZonasAction] = React.useState<'add' | 'edit' | 'delete' | ''>('')
  const LocalAddDialog = AddDialog

  const eventosAutocompleteData = useSelector((state: IState) => state.eventos)
  const [NombreEventoOptions, setNombreEventoOptions] = React.useState<{ label: String; value: String }[]>([])
  const typeInSearchNombreEventoEventos = (typedIn) => {
    const searchOptions = { searchString: typedIn, searchField: 'Nombre', page: 1, limit: 10 }
    axios.get('http://127.0.0.1:4567/api/eventos/search/', { params: searchOptions }).then((result) => {
      setNombreEventoOptions(
        result.data.docs.map((evento) => {
          return { label: evento.Nombre, value: evento._id }
        })
      )
    })
  }
  const [NombreEventoValue, setNombreEventoValue] = React.useState(null)
  React.useEffect(() => {
    if (!Zonasdata.NombreEvento) return undefined
    const asArray = Array.isArray(Zonasdata.NombreEvento) ? Zonasdata.NombreEvento : [Zonasdata.NombreEvento]
    setNombreEventoValue(asArray.map((item) => ({ label: item.Nombre, value: item._id })))
  }, [Zonasdata.NombreEvento])
  const [tableloadoptions, settableloadoptions] = React.useState<any>({
    page: 1,
    populate: true,
    limit: 25,
    sort: { field: null, method: 'DESC' },
    totalItems: 0,
  })
  const performtableload = (options) => {
    dispatch(options.searchString ? searchZonas(options) : loadZonas(options))
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
                    color=""
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

            <NavLink exact to="/Ubicaciones" key="O1dAlMUs">
              <ListItem button className={classes.itemLink}>
                <ListItemText>Ubicaciones</ListItemText>
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
                <Typography variant="h4">Zona list</Typography>
              </div>

              <Paper square>
                <div title="Table Area" className={classes.tableResponsive}>
                  <div title="Table Toolbar" className={theme.tabletoolbar}>
                    <TextField
                      variant="outlined"
                      placeholder="Search Zona..."
                      margin="normal"
                      className={theme.extensibleInput}
                      type="text"
                      onChange={searchForZonas}
                    />

                    <LocalAddDialog
                      isOpen={dialogZonasAction !== ''}
                      onOpen={() => setdialogZonasAction('add')}
                      onSave={() => setdialogZonasAction('')}
                      onClose={() => setdialogZonasAction('')}
                      action={dialogZonasAction}
                      addOptions={{ title: 'Add Zona', text: 'Enter Zona data', button: 'Add' }}
                      editOptions={{ title: 'Edit Zona', text: 'Update Zona data', button: 'Edit' }}
                      removeOptions={{ title: '', text: '', button: '' }}
                      saveDataHandler={(data: IZonasItem) => {
                        if (dialogZonasAction === 'delete') {
                          dispatch(removeZona(data))
                        } else {
                          dialogZonasAction === 'add' ? dispatch(addZonas(data)) : dispatch(editZonas(data))
                        }
                      }}
                      color="primary"
                      data={Zonasdata}
                      initialData={initialDataZonas}
                      setData={setZonasData}
                      allowMultipleSubmit={dialogZonasAction === 'add'}
                    >
                      <TextField
                        margin="dense"
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
                        margin="dense"
                        label="Precio"
                        className={'field_Precio'}
                        type="number"
                        fullWidth
                        variant="standard"
                        value={Zonasdata.Precio || ''}
                        onChange={handleZonasChange('Precio')}
                      />

                      <Autocomplete
                        value={NombreEventoValue}
                        onType={typeInSearchNombreEventoEventos}
                        onChange={(newValue) =>
                          handleZonasChange('NombreEvento')(
                            newValue?.length ? newValue.map((item) => ({ _id: item.value !== 'new' ? item.value : null, Nombre: item.label })) : []
                          )
                        }
                        loading={eventosAutocompleteData.loadingStatus === 'loading'}
                        options={NombreEventoOptions}
                        label="NombreEvento"
                        fullWidth
                        variant="standard"
                        margin="dense"
                      />
                    </LocalAddDialog>
                  </div>

                  <div title="Body">
                    <Table
                      tableHead={['Nombre', 'Precio', 'NombreEvento', 'Actions']}
                      tableData={zonasData.foundzonas.length ? zonasData.foundzonas : (zonasData.zonas as any)}
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

                      <Field value={(fieldData: any) => fieldData.Precio} />

                      <Field value={(fieldData: any) => (fieldData.NombreEvento ? fieldData.NombreEvento.Nombre : '')} />
                      <div className={classes.actionsArea}>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClickCapture={(e: any) => {
                            setZonasData(e.element)
                            setdialogZonasAction('edit')
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClickCapture={(e: any) => {
                            dispatch(removeZona(e.element))
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

export default Zonas
