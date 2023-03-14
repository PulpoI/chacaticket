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
import { addAsientos, editAsientos, loadAsientos, removeAsiento, searchAsientos } from '../store/actions/asientosActions'
import { IAsientosItem } from '../store/models'
import { IState } from '../store/reducers/index'

const aptugotheme = createTheme({
  palette: {
    primary: green,
  },
})

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const Asientos: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const initialDataAsientos = {
    Ubicacion: '',
    NombreZona: null,
  }
  const [Asientosdata, setAsientosData] = React.useState<any>(initialDataAsientos)
  const handleAsientosChange = (name: string) => (event: any) => {
    const value = event?.target ? (event.target.files ? event.target.files[0] : event.currentTarget?.value || event.target.value) : event
    setAsientosData({
      ...Asientosdata,
      [name]: value,
    })
  }
  const asientosData = useSelector((state: IState) => state.asientos)
  const [lang, setlang] = React.useState<any>('en')
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const dispatch = useDispatch()
  let searchTimeout = null
  const searchForAsientos = (event, field = null) => {
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
    dispatch(options.searchString ? searchAsientos(options) : loadAsientos(options))
  }
  React.useEffect(() => {
    performsearchFieldload({
      ...searchFieldloadoptions,
    })
  }, [searchFieldloadoptions])
  const [dialogAsientosAction, setdialogAsientosAction] = React.useState<'add' | 'edit' | 'delete' | ''>('')
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
    if (!Asientosdata.NombreZona) return undefined
    const asArray = Array.isArray(Asientosdata.NombreZona) ? Asientosdata.NombreZona : [Asientosdata.NombreZona]
    setNombreZonaValue(asArray.map((item) => ({ label: item.Nombre, value: item._id })))
  }, [Asientosdata.NombreZona])
  const [tableloadoptions, settableloadoptions] = React.useState<any>({
    page: 1,
    populate: true,
    limit: 25,
    sort: { field: null, method: 'DESC' },
    totalItems: 0,
  })
  const performtableload = (options) => {
    dispatch(options.searchString ? searchAsientos(options) : loadAsientos(options))
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

  React.useEffect(() => {
    if (typeof langStrings !== 'undefined') {
      setlang(langStrings[localStorage.getItem('aptugolang') || 'en'])
    }
  }, [])

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

            <NavLink exact to="/Asientos" key="O1dAlMUs">
              <ListItem button className={classes.itemLink}>
                <ListItemText>Asientos</ListItemText>
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
                <Typography variant="h4">Asiento list</Typography>
              </div>

              <Paper square>
                <div title="Table Area" className={classes.tableResponsive}>
                  <div title="Table Toolbar" className={theme.tabletoolbar}>
                    <TextField
                      variant="outlined"
                      placeholder="Search Asiento..."
                      margin="normal"
                      className={theme.extensibleInput}
                      type="text"
                      onChange={searchForAsientos}
                    />

                    <LocalAddDialog
                      isOpen={dialogAsientosAction !== ''}
                      onOpen={() => setdialogAsientosAction('add')}
                      onSave={() => setdialogAsientosAction('')}
                      onClose={() => setdialogAsientosAction('')}
                      action={dialogAsientosAction}
                      addOptions={{ title: 'Add Asiento', text: 'Enter Asiento data', button: 'Add' }}
                      editOptions={{ title: 'Edit Asiento', text: 'Update Asiento data', button: 'Edit' }}
                      removeOptions={{ title: '', text: '', button: '' }}
                      saveDataHandler={(data: IAsientosItem) => {
                        if (dialogAsientosAction === 'delete') {
                          dispatch(removeAsiento(data))
                        } else {
                          dialogAsientosAction === 'add' ? dispatch(addAsientos(data)) : dispatch(editAsientos(data))
                        }
                      }}
                      color="primary"
                      data={Asientosdata}
                      initialData={initialDataAsientos}
                      setData={setAsientosData}
                      allowMultipleSubmit={dialogAsientosAction === 'add'}
                    >
                      <TextField
                        margin="dense"
                        label="Ubicacion"
                        type="text"
                        fullWidth
                        className={'field_Ubicacion'}
                        variant="standard"
                        value={Asientosdata.Ubicacion || ''}
                        onChange={handleAsientosChange('Ubicacion')}
                        error={asientosData?.errField === 'Ubicacion'}
                        helperText={asientosData?.errField === 'Ubicacion' && asientosData.errMessage}
                      />

                      <Autocomplete
                        value={NombreZonaValue}
                        onType={typeInSearchNombreZonaZonas}
                        onChange={(newValue) =>
                          handleAsientosChange('NombreZona')(
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
                      tableHead={['Ubicacion', 'NombreZona', 'Actions']}
                      tableData={asientosData.foundasientos.length ? asientosData.foundasientos : (asientosData.asientos as any)}
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
                      <Field value={(fieldData: any) => fieldData.Ubicacion} />

                      <Field value={(fieldData: any) => (fieldData.NombreZona ? fieldData.NombreZona.Nombre : '')} />
                      <div className={classes.actionsArea}>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClickCapture={(e: any) => {
                            setAsientosData(e.element)
                            setdialogAsientosAction('edit')
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClickCapture={(e: any) => {
                            dispatch(removeAsiento(e.element))
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

export default Asientos
