import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import AppBar from '@mui/material/AppBar'
import Checkbox from '@mui/material/Checkbox'
import green from '@mui/material/colors/green'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
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
import Sidebar from '../components/Sidebar/Sidebar'
import Field from '../components/Table/Field'
import Table from '../components/Table/Table'
import { addTickets, editTickets, loadTickets, removeTicket, searchTickets } from '../store/actions/ticketsActions'
import { ITicketsItem } from '../store/models'
import { IState } from '../store/reducers/index'
export { RadioButtonUncheckedIcon }

const aptugotheme = createTheme({
  palette: {
    primary: green,
  },
})

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const Tickets: FunctionComponent = (props: any) => {
  const {
    history: navigation,
    match: { params },
  } = props
  const classes = baseClasses
  const initialDataTickets = {
    NombreUbicacion: '',
    NombreZona: null,
    NombrePersona: '',
    EmailPersona: '',
    FechaPago: '',
    Usado: false,
  }
  const [Ticketsdata, setTicketsData] = React.useState<any>(initialDataTickets)
  const handleTicketsChange = (name: string) => (event: any) => {
    const value = event?.target ? (event.target.files ? event.target.files[0] : event.currentTarget?.value || event.target.value) : event
    setTicketsData({
      ...Ticketsdata,
      [name]: value,
    })
  }
  const ticketsData = useSelector((state: IState) => state.tickets)
  const theme = thememodulescss
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const dispatch = useDispatch()
  let searchTimeout = null
  const searchForTickets = (event, field = null) => {
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
    dispatch(options.searchString ? searchTickets(options) : loadTickets(options))
  }
  React.useEffect(() => {
    performsearchFieldload({
      ...searchFieldloadoptions,
    })
  }, [searchFieldloadoptions])
  const [dialogTicketsAction, setdialogTicketsAction] = React.useState<'add' | 'edit' | 'delete' | ''>('')
  const LocalAddDialog = AddDialog

  const zonasAutocompleteData = useSelector((state: IState) => state.zonas)
  const [NombreZonaOptions, setNombreZonaOptions] = React.useState<{ label: String; value: String }[]>([])
  const typeInSearchNombreZonaZonas = (typedIn) => {
    const searchOptions = { searchString: typedIn, searchField: 'Nombre', page: 1, limit: 25 }
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
    if (!Ticketsdata.NombreZona) return undefined
    const asArray = Array.isArray(Ticketsdata.NombreZona) ? Ticketsdata.NombreZona : [Ticketsdata.NombreZona]
    setNombreZonaValue(asArray.map((item) => ({ label: item.Nombre, value: item._id })))
  }, [Ticketsdata.NombreZona])
  const [tableloadoptions, settableloadoptions] = React.useState<any>({
    page: 1,
    populate: true,
    limit: 25,
    sort: { field: null, method: 'DESC' },
    totalItems: 0,
  })
  const performtableload = (options) => {
    dispatch(options.searchString ? searchTickets(options) : loadTickets(options))
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
                <Typography variant="h4">Ticket list</Typography>
              </div>

              <Paper square>
                <div title="Table Area" className={classes.tableResponsive}>
                  <div title="Table Toolbar" className={theme.tabletoolbar}>
                    <TextField
                      variant="outlined"
                      placeholder="Search Ticket..."
                      margin="dense"
                      size="small"
                      className={theme.extensibleInput}
                      type="text"
                      onChange={searchForTickets}
                    />

                    <LocalAddDialog
                      isOpen={dialogTicketsAction !== ''}
                      onOpen={() => setdialogTicketsAction('add')}
                      onSave={() => setdialogTicketsAction('')}
                      onClose={() => setdialogTicketsAction('')}
                      action={dialogTicketsAction}
                      addOptions={{ title: 'Add Ticket', text: 'Enter Ticket data', button: 'Add' }}
                      editOptions={{ title: 'Edit Ticket', text: 'Update Ticket data', button: 'Edit' }}
                      removeOptions={{ title: '', text: '', button: '' }}
                      saveDataHandler={(data: ITicketsItem) => {
                        if (dialogTicketsAction === 'delete') {
                          dispatch(removeTicket(data))
                        } else {
                          dialogTicketsAction === 'add' ? dispatch(addTickets(data)) : dispatch(editTickets(data))
                        }
                      }}
                      color="primary"
                      data={Ticketsdata}
                      initialData={initialDataTickets}
                      setData={setTicketsData}
                      allowMultipleSubmit={dialogTicketsAction === 'add'}
                    >
                      <TextField
                        margin="dense"
                        label="NombreUbicacion"
                        type="text"
                        fullWidth
                        className={'field_NombreUbicacion'}
                        variant="standard"
                        value={Ticketsdata.NombreUbicacion || ''}
                        onChange={handleTicketsChange('NombreUbicacion')}
                        error={ticketsData?.errField === 'NombreUbicacion'}
                        helperText={ticketsData?.errField === 'NombreUbicacion' && ticketsData.errMessage}
                      />

                      <Autocomplete
                        value={NombreZonaValue}
                        onType={typeInSearchNombreZonaZonas}
                        onChange={(newValue) =>
                          handleTicketsChange('NombreZona')(
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

                      <TextField
                        margin="dense"
                        label="NombrePersona"
                        type="text"
                        fullWidth
                        className={'field_NombrePersona'}
                        variant="standard"
                        value={Ticketsdata.NombrePersona || ''}
                        onChange={handleTicketsChange('NombrePersona')}
                        error={ticketsData?.errField === 'NombrePersona'}
                        helperText={ticketsData?.errField === 'NombrePersona' && ticketsData.errMessage}
                      />

                      <TextField
                        margin="dense"
                        label="EmailPersona"
                        type="text"
                        fullWidth
                        className={'field_EmailPersona'}
                        variant="standard"
                        value={Ticketsdata.EmailPersona || ''}
                        onChange={handleTicketsChange('EmailPersona')}
                        error={ticketsData?.errField === 'EmailPersona'}
                        helperText={ticketsData?.errField === 'EmailPersona' && ticketsData.errMessage}
                      />

                      <TextField
                        label="FechaPago"
                        type="datetime-local"
                        fullWidth
                        step="900"
                        value={
                          Ticketsdata.FechaPago
                            ? new Date(
                                new Date(Ticketsdata.FechaPago).setMinutes(
                                  new Date(Ticketsdata.FechaPago).getMinutes() - new Date().getTimezoneOffset()
                                )
                              )
                                .toISOString()
                                .slice(0, 16)
                            : ''
                        }
                        onChange={handleTicketsChange('FechaPago')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Ticketsdata.Usado}
                            color="primary"
                            onChange={(e) => handleTicketsChange('Usado')(e.currentTarget.checked)}
                          />
                        }
                        label="Usado"
                      />
                    </LocalAddDialog>
                  </div>

                  <div title="Body">
                    <Table
                      tableHead={['NombreUbicacion', 'NombreZona', 'NombrePersona', 'EmailPersona', 'FechaPago', 'Usado', 'Actions']}
                      tableData={ticketsData.foundtickets.length ? ticketsData.foundtickets : (ticketsData.tickets as any)}
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
                      <Field value={(fieldData: any) => fieldData.NombreUbicacion} />

                      <Field value={(fieldData: any) => (fieldData.NombreZona ? fieldData.NombreZona.Nombre : '')} />

                      <Field value={(fieldData: any) => fieldData.NombrePersona} />

                      <Field value={(fieldData: any) => fieldData.EmailPersona} />

                      <Field value={(fieldData: any) => moment(fieldData.FechaPago).format('DD/MM/YYYY HH:mm')} />

                      <Field value={(fieldData: any) => (fieldData.Usado ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />)} />

                      <div className={classes.actionsArea}>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClickCapture={(e: any) => {
                            setTicketsData(e.element)
                            setdialogTicketsAction('edit')
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClickCapture={(e: any) => {
                            dispatch(removeTicket(e.element))
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

export default Tickets
