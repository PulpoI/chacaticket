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
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import AddDialog from '../components/Dialog/Dialog'
import FileUpload from '../components/FileUpload/FileUpload'
import Sidebar from '../components/Sidebar/Sidebar'
import Field from '../components/Table/Field'
import Table from '../components/Table/Table'
import minimum from '../components/Themes/minimum.module.scss'
import { addUsers, editUsers, loadUsers, removeUsersrecord, searchUsers } from '../store/actions/usersActions'
import { IUsersItem } from '../store/models'
import { IState } from '../store/reducers/index'

const aptugotheme = createTheme({
  palette: {
    primary: green,
  },
})

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const Users: FunctionComponent = (props: any) => {
  const classes = baseClasses
  const initialDataUsers = {
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    ProfilePic: '',
    Role: '',
    Lugar: '',
  }
  const [Usersdata, setUsersData] = React.useState<any>(initialDataUsers)
  const handleUsersChange = (name: string) => (event: any) => {
    const value = event?.target ? (event.target.files ? event.target.files[0] : event.currentTarget?.value || event.target.value) : event
    setUsersData({
      ...Usersdata,
      [name]: value,
    })
  }
  const usersData = useSelector((state: IState) => state.users)
  const theme = minimum
  const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
  const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
  const dispatch = useDispatch()
  let searchTimeout = null
  const searchForUsers = (event, field = null) => {
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
    dispatch(options.searchString ? searchUsers(options) : loadUsers(options))
  }
  React.useEffect(() => {
    performsearchFieldload({
      ...searchFieldloadoptions,
    })
  }, [searchFieldloadoptions])
  const [dialogUsersAction, setdialogUsersAction] = React.useState<'add' | 'edit' | 'delete' | ''>('')
  const LocalAddDialog = AddDialog

  const [tableloadoptions, settableloadoptions] = React.useState<any>({
    page: 1,
    populate: true,
    limit: 25,
    sort: { field: null, method: 'DESC' },
    totalItems: 0,
  })
  const performtableload = (options) => {
    dispatch(options.searchString ? searchUsers(options) : loadUsers(options))
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
                <Typography variant="h4">Usersrecord list</Typography>
              </div>

              <Paper square>
                <div title="Table Area" className={classes.tableResponsive}>
                  <div title="Table Toolbar" className={theme.tabletoolbar}>
                    <TextField
                      variant="outlined"
                      placeholder="Search Usersrecord..."
                      margin="normal"
                      className={theme.extensibleInput}
                      type="text"
                      onChange={searchForUsers}
                    />

                    <LocalAddDialog
                      isOpen={dialogUsersAction !== ''}
                      onOpen={() => setdialogUsersAction('add')}
                      onSave={() => setdialogUsersAction('')}
                      onClose={() => setdialogUsersAction('')}
                      action={dialogUsersAction}
                      addOptions={{ title: 'Add Usersrecord', text: 'Enter Usersrecord data', button: 'Add' }}
                      editOptions={{ title: 'Edit Usersrecord', text: 'Update Usersrecord data', button: 'Edit' }}
                      removeOptions={{ title: '', text: '', button: '' }}
                      saveDataHandler={(data: IUsersItem) => {
                        if (dialogUsersAction === 'delete') {
                          dispatch(removeUsersrecord(data))
                        } else {
                          dialogUsersAction === 'add' ? dispatch(addUsers(data)) : dispatch(editUsers(data))
                        }
                      }}
                      color="primary"
                      data={Usersdata}
                      initialData={initialDataUsers}
                      setData={setUsersData}
                      allowMultipleSubmit={dialogUsersAction === 'add'}
                    >
                      <TextField
                        margin="dense"
                        label="First Name"
                        type="text"
                        fullWidth
                        className={'field_FirstName'}
                        variant="standard"
                        value={Usersdata.FirstName || ''}
                        onChange={handleUsersChange('FirstName')}
                        error={usersData?.errField === 'FirstName'}
                        helperText={usersData?.errField === 'FirstName' && usersData.errMessage}
                      />

                      <TextField
                        margin="dense"
                        label="Last Name"
                        type="text"
                        fullWidth
                        className={'field_LastName'}
                        variant="standard"
                        value={Usersdata.LastName || ''}
                        onChange={handleUsersChange('LastName')}
                        error={usersData?.errField === 'LastName'}
                        helperText={usersData?.errField === 'LastName' && usersData.errMessage}
                      />

                      <TextField
                        margin="dense"
                        label="Email"
                        type="text"
                        fullWidth
                        className={'field_Email'}
                        variant="standard"
                        value={Usersdata.Email || ''}
                        onChange={handleUsersChange('Email')}
                        error={usersData?.errField === 'Email'}
                        helperText={usersData?.errField === 'Email' && usersData.errMessage}
                      />

                      <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={Usersdata.Password}
                        onChange={handleUsersChange('Password')}
                        error={usersData?.errField === 'Password'}
                        helperText={usersData?.errField === 'Password' && usersData.errMessage}
                      />

                      <FileUpload
                        label="Profile Picture"
                        value={Usersdata.ProfilePic}
                        onChange={handleUsersChange('ProfilePic')}
                        variant="standard"
                      />

                      <TextField
                        select
                        margin="dense"
                        label="Role"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={Usersdata.Role}
                        onChange={handleUsersChange('Role')}
                      >
                        <MenuItem key="User" value="User">
                          User
                        </MenuItem>
                        <MenuItem key="Admin" value="Admin">
                          Admin
                        </MenuItem>
                        <MenuItem key="Lugar" value="Lugar">
                          Lugar
                        </MenuItem>
                      </TextField>

                      <TextField
                        margin="dense"
                        label="Lugar"
                        type="text"
                        fullWidth
                        className={'field_Lugar'}
                        variant="standard"
                        value={Usersdata.Lugar || ''}
                        onChange={handleUsersChange('Lugar')}
                        error={usersData?.errField === 'Lugar'}
                        helperText={usersData?.errField === 'Lugar' && usersData.errMessage}
                      />
                    </LocalAddDialog>
                  </div>

                  <div title="Body">
                    <Table
                      tableHead={['First Name', 'Last Name', 'Email', 'Password', 'Profile Picture', 'Role', 'Lugar', 'Actions']}
                      tableData={usersData.foundusers.length ? usersData.foundusers : (usersData.users as any)}
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
                      <Field value={(fieldData: any) => fieldData.FirstName} />

                      <Field value={(fieldData: any) => fieldData.LastName} />

                      <Field value={(fieldData: any) => fieldData.Email} />

                      <Field value={'*****'} />

                      <Field value={(fieldData: any) => (fieldData.ProfilePic ? <img src={`/img/${fieldData.ProfilePic}`} /> : <div />)} />

                      <Field value={(fieldData: any) => fieldData.Role} />

                      <Field value={(fieldData: any) => fieldData.Lugar} />
                      <div className={classes.actionsArea}>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClickCapture={(e: any) => {
                            setUsersData(e.element)
                            setdialogUsersAction('edit')
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClickCapture={(e: any) => {
                            dispatch(removeUsersrecord(e.element))
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

export default Users
