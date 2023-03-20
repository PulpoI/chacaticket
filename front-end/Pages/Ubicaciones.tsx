
import React, { FunctionComponent } from 'react'
import baseClasses from './layout.module.scss'

  import minimum from '../components/Themes/minimum.module.scss'
  import { mergeClasses } from '../services/utils'
  import Typography from '@mui/material/Typography'
  import { useDispatch } from 'react-redux'
  import { load, search } from '../store/actions/Actions'
  import { IState } from '../store/reducers/index'
  import { useSelector } from 'react-redux'
  import TextField from '@mui/material/TextField'
  import { IItem } from '../store/models'
  import { add } from '../store/actions/Actions'
  import { edit } from '../store/actions/Actions'
  import { remove } from '../store/actions/Actions'
  import AddDialog from '../components/Dialog/Dialog'
  import { add, load, remove, edit } from '../store/actions/Actions'
  import Table from '../components/Table/Table'
  import EditIcon from '@mui/icons-material/Edit'
  import DeleteIcon from '@mui/icons-material/Delete'
  import IconButton from '@mui/material/IconButton'
  import MoreIcon from '@mui/icons-material/More'
  import Paper from '@mui/material/Paper'
  import Container from '@mui/material/Container'
  import IconButton from '@mui/material/IconButton'
  import Icon from '@mui/icons-material/'
  import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
  import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
  import { NavLink } from 'react-router-dom'
  import ListItem from '@mui/material/ListItem'
  import ListItemText from '@mui/material/ListItemText'
  import Sidebar from '../components/Sidebar/Sidebar'
  import green from '@mui/material/colors/green'
  import { createTheme, ThemeProvider } from '@mui/material/styles'

const aptugotheme = createTheme({
    palette: {
    primary: green,
  },
    
})
  

import authHeaders from '../services/auth-header'
import AuthService from '../services/auth.service'

const Ubicaciones: FunctionComponent = (props: any) => {
      const classes = baseClasses
        const Data = useSelector((state: IState) => state.)
      const theme = minimum
      const [currentUser, setcurrentUser] = React.useState<any>(AuthService.getCurrentUser())
      const [profileMenuAnchor, setprofileMenuAnchor] = React.useState<any>(null)
      const dispatch = useDispatch()
      let searchTimeout = null
const searchFor = (event, field = null) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      settableloadoptions({
        ...tableloadoptions,
        searchString: event.target.value,
        searchField: field
      })
    },500)
}
      const [searchFieldloadoptions, setsearchFieldloadoptions] = React.useState<any>({ 
  page: 1,
  populate: true,
  limit: 25,
  sort: { field: null, method: 'DESC' },
    totalItems: 0
})
const performsearchFieldload = (options) => {
      dispatch(options.searchString ? search(options) : load(options))
  }
      React.useEffect(() => {
  performsearchFieldload({
    ...searchFieldloadoptions
                  })
},[searchFieldloadoptions])
      const [dialogAction, setdialogAction] = React.useState<'add' | 'edit' | 'delete' | "">('')
      const LocalAddDialog = AddDialog
      const [tableloadoptions, settableloadoptions] = React.useState<any>({ 
  page: 1,
  populate: true,
  limit: 25,
  sort: { field: null, method: 'DESC' },
    totalItems: 0
})
const performtableload = (options) => {
      dispatch(options.searchString ? search(options) : load(options))
  }
      React.useEffect(() => {
  performtableload({
    ...tableloadoptions
                  })
},[tableloadoptions])
  
  


if (!authHeaders()) { 
  props.history.push("/Login")
}



// Theme selection
    



  return (<React.Fragment>




<ThemeProvider theme={aptugotheme}>
  <div className={ theme.pages } >

  { currentUser &&
  <React.Fragment>  

<AppBar
    elevation={ 3 }
    color='transparent'    position='absolute'    title=''
>
<Toolbar >



<IconButton
      color=""
        onClick={ (event) => { setprofileMenuAnchor(event.currentTarget) } }
        className={ theme.profilePicture }
  >
    
<picture>
    <img
        src={`/img/${currentUser.ProfilePic}`}
    alt={`/img/${currentUser.ProfilePic}`}
              />
</picture>


</IconButton>

  <Menu
    anchorEl={ profileMenuAnchor }
  anchorOrigin={ {
     vertical: 'top',      horizontal: 'center',   } }
  transformOrigin={ {
    vertical: 'top',
    horizontal: 'center',
  } }
  open={ Boolean(profileMenuAnchor) }
      onClose={ (params) => { setprofileMenuAnchor(null)} }
  >

<div
  title="div"
        className={ theme.menuProfileDetails }
        >

  {currentUser.FirstName} {currentUser.LastName}
  

</div>

<MenuItem
          >
  
  Profile
  

</MenuItem>
<MenuItem
        onClick={ (params) => { AuthService.logout(); props.history.push('/') } }
        >
  
  Logout
  

</MenuItem>
</Menu>
</Toolbar>
</AppBar>

  </React.Fragment>  }



<Sidebar
    color='Greens'
        open={ true }
>




<NavLink
  exact
  to="/"
      key='PwMtQTDG'
>
  <ListItem button className={classes.itemLink}>
    <ListItemText>
      Home      
    </ListItemText>
  </ListItem>
</NavLink>
  						                



<NavLink
  exact
  to="/Users"
      key='8SQBot4h'
>
  <ListItem button className={classes.itemLink}>
    <ListItemText>
      Users      
    </ListItemText>
  </ListItem>
</NavLink>      	                



<NavLink
  exact
  to="/Eventos"
      key='sVk7qg0m'
>
  <ListItem button className={classes.itemLink}>
    <ListItemText>
      Eventos      
    </ListItemText>
  </ListItem>
</NavLink>      	                



<NavLink
  exact
  to="/Zonas"
      key='T6sC3Ag2'
>
  <ListItem button className={classes.itemLink}>
    <ListItemText>
      Zonas      
    </ListItemText>
  </ListItem>
</NavLink>      	                



<NavLink
  exact
  to="/Ubicaciones"
      key='Tawlxf86'
>
  <ListItem button className={classes.itemLink}>
    <ListItemText>
      Ubicaciones      
    </ListItemText>
  </ListItem>
</NavLink>      	                



<NavLink
  exact
  to="/Tickets"
      key='H8KZ2Tuy'
>
  <ListItem button className={classes.itemLink}>
    <ListItemText>
      Tickets      
    </ListItemText>
  </ListItem>
</NavLink>      
</Sidebar>
<div
  title="div"
        className={ theme.mainarea }
        >


<Container
              maxWidth="lg"
            >
  
<div
  title="Head"
        className={ theme.tableHeading }
        >


<Typography
  variant="h4"
    >

  Ubicacion list
  

</Typography>

</div>


<Paper
      square
        >

<div
  title="Table Area"
        className={ classes.tableResponsive }
        >

<div
  title="Table Toolbar"
        className={ theme.tabletoolbar }
        >





  
    










  

<TextField
    variant="outlined"
        placeholder="Search ..."                margin="normal"        className={ theme.extensibleInput }                  type="text"
                onChange={ searchFor }/>



  







<LocalAddDialog
      isOpen={ dialogAction !== ''}
  onOpen={() => setdialogAction('add')}
      onSave={() => setdialogAction('')}
    onClose={() => setdialogAction('')}
  action={ dialogAction }
  addOptions={ { title: 'Add Ubicacion', text: 'Enter Ubicacion data', button: 'Add' } }
  editOptions={ { title: 'Edit Ubicacion', text: 'Update Ubicacion data', button: 'Edit' } }
  removeOptions={ { title: '', text: '', button: '' } }
  saveDataHandler={ (data: IItem ) => {
          if (dialogAction === 'delete') {
        dispatch(remove(data))
      } else {
        dialogAction === 'add' ? dispatch(add(data)) : dispatch(edit(data))
      }      
      } }
  color='primary'
  data={ data}
  initialData={initialData}
  setData={setData}
  allowMultipleSubmit={ dialogAction === 'add'}
>

</LocalAddDialog>

</div>

<div
  title="Body"
          >

                  
    










                      


<Table    
    tableHead={
              ["Actions"]
          }
    tableData={ (Data.found.length ? Data.found : Data. as any) }
          orderBy={ tableloadoptions.sort.field }
      order={ tableloadoptions.sort.method }
      onRequestSort={(event, property) => {
        settableloadoptions({
          ...tableloadoptions,
          sort: {
            field: property,
            method: tableloadoptions.sort.field === property ? (tableloadoptions.sort.method === 'asc' ? 'desc' : 'asc') : 'ASC',
          }
        })
      }}
    ><div className={classes.actionsArea}>
            <IconButton
      aria-label="edit"
      color="primary"
      onClickCapture={(e: any) => { 
                  setData(e.element)
          setdialogAction('edit')
              }}
    >
      <EditIcon fontSize="small" />
    </IconButton>
            <IconButton aria-label="delete" color="primary" onClickCapture={(e: any) => {
              dispatch(remove (e.element))
          }}>
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


</React.Fragment>)}


export default Ubicaciones


