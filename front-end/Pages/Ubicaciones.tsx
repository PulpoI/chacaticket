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
import { addUbicaciones, editUbicaciones, loadUbicaciones, removeUbicacion, searchUbicaciones } from '../store/actions/ubicacionesActions'
import { IUbicacionesItem } from '../store/models'
import { IState } from '../store/reducers/index'

const aptugotheme = createTheme({
  palette: {
    primary: green,
  },
})

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const Ubicaciones: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const initialDataUbicaciones = {
    Nombre: '',
    NombreZona: null,
  }
  const [Ubicacionesdata, setUbicacionesData] = React.useState<any>(initialDataUbicaciones)
  const handleUbicacionesChange = (name: string) => (event: any) => {
    const value = event?.target ? (event.target.files ? event.target.files[0] : event.currentTarget?.value || event.target.value) : event
    setUbicacionesData({
      ...Ubicacionesdata,
      [name]: value,
    })
  }
  const ubicacionesData = useSelector((state: IState) => state.ubicaciones)
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const dispatch = useDispatch()
  let searchTimeout = null
  const searchForUbicaciones = (event, field = null) => {
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
    dispatch(options.searchString ? searchUbicaciones(options) : loadUbicaciones(options))
  }
  React.useEffect(() => {
    performsearchFieldload({
      ...searchFieldloadoptions,
    })
  }, [searchFieldloadoptions])
  const [dialogUbicacionesAction, setdialogUbicacionesAction] = React.useState<'add' | 'edit' | 'delete' | ''>('')
  const LocalAddDialog = AddDialog

  const zonasAutocompleteData = useSelector((state: IState) => state.zonas)
  const [NombreZonaOptions, setNombreZonaOptions] = React.useState<{ label: String; value: String }[]>([])
  const typeInSearchNombreZonaZonas = (typedIn) => {
    const searchOptions = { searchString: typedIn, searchField: 'Nombre', page: 1, limit: 10 }
    axios.get('http://127.0.0.1:4567/api/zonas/search/', { params: searchOptions }).then((result) => {
      setNombreZonaOptions(
        result.data.docs.map((zona) => {
          return { label: zona.Nombre, value: zona._id }
        })
      )
    })
  }
  const [NombreZonaValue, setNombreZonaValue] = React.useState(null)
  React.useEffect(() => {
    if (!Ubicacionesdata.NombreZona) return undefined
    const asArray = Array.isArray(Ubicacionesdata.NombreZona) ? Ubicacionesdata.NombreZona : [Ubicacionesdata.NombreZona]
    setNombreZonaValue(asArray.map((item) => ({ label: item.Nombre, value: item._id })))
  }, [Ubicacionesdata.NombreZona])
  const [tableloadoptions, settableloadoptions] = React.useState<any>({
    page: 1,
    populate: true,
    limit: 25,
    sort: { field: null, method: 'DESC' },
    totalItems: 0,
  })
  const performtableload = (options) => {
    dispatch(options.searchString ? searchUbicaciones(options) : loadUbicaciones(options))
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
                <Typography variant="h4">Ubicacion list</Typography>
              </div>

              <Paper square>
                <div title="Table Area" className={classes.tableResponsive}>
                  <div title="Table Toolbar" className={theme.tabletoolbar}>
                    <TextField
                      variant="outlined"
                      placeholder="Search Ubicacion..."
                      margin="normal"
                      className={theme.extensibleInput}
                      type="text"
                      onChange={searchForUbicaciones}
                    />

                    <LocalAddDialog
                      isOpen={dialogUbicacionesAction !== ''}
                      onOpen={() => setdialogUbicacionesAction('add')}
                      onSave={() => setdialogUbicacionesAction('')}
                      onClose={() => setdialogUbicacionesAction('')}
                      action={dialogUbicacionesAction}
                      addOptions={{ title: 'Add Ubicacion', text: 'Enter Ubicacion data', button: 'Add' }}
                      editOptions={{ title: 'Edit Ubicacion', text: 'Update Ubicacion data', button: 'Edit' }}
                      removeOptions={{ title: '', text: '', button: '' }}
                      saveDataHandler={(data: IUbicacionesItem) => {
                        if (dialogUbicacionesAction === 'delete') {
                          dispatch(removeUbicacion(data))
                        } else {
                          dialogUbicacionesAction === 'add' ? dispatch(addUbicaciones(data)) : dispatch(editUbicaciones(data))
                        }
                      }}
                      color="primary"
                      data={Ubicacionesdata}
                      initialData={initialDataUbicaciones}
                      setData={setUbicacionesData}
                      allowMultipleSubmit={dialogUbicacionesAction === 'add'}
                    >
                      <TextField
                        margin="dense"
                        label="Nombre"
                        type="text"
                        fullWidth
                        className={'field_Nombre'}
                        variant="standard"
                        value={Ubicacionesdata.Nombre || ''}
                        onChange={handleUbicacionesChange('Nombre')}
                        error={ubicacionesData?.errField === 'Nombre'}
                        helperText={ubicacionesData?.errField === 'Nombre' && ubicacionesData.errMessage}
                      />

                      <Autocomplete
                        value={NombreZonaValue}
                        onType={typeInSearchNombreZonaZonas}
                        onChange={(newValue) =>
                          handleUbicacionesChange('NombreZona')(
                            newValue?.length ? newValue.map((item) => ({ _id: item.value !== 'new' ? item.value : null, Nombre: item.label })) : []
                          )
                        }
                        loading={zonasAutocompleteData.loadingStatus === 'loading'}
                        options={NombreZonaOptions}
                        label="NombreZona"
                        fullWidth
                        variant="standard"
                        margin="dense"
                      />
                    </LocalAddDialog>
                  </div>

                  <div title="Body">
                    <Table
                      tableHead={['Nombre', 'NombreZona', 'Actions']}
                      tableData={ubicacionesData.foundubicaciones.length ? ubicacionesData.foundubicaciones : (ubicacionesData.ubicaciones as any)}
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

                      <Field value={(fieldData: any) => (fieldData.NombreZona ? fieldData.NombreZona.Nombre : '')} />
                      <div className={classes.actionsArea}>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClickCapture={(e: any) => {
                            setUbicacionesData(e.element)
                            setdialogUbicacionesAction('edit')
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClickCapture={(e: any) => {
                            dispatch(removeUbicacion(e.element))
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

export default Ubicaciones
