import React from 'react'
import { Route, Switch } from 'react-router-dom'

const Tickets = React.lazy(() => import('./Pages/Tickets'))
const Ubicaciones = React.lazy(() => import('./Pages/Ubicaciones'))
const Zonas = React.lazy(() => import('./Pages/Zonas'))
const Eventos = React.lazy(() => import('./Pages/Eventos'))
const Users = React.lazy(() => import('./Pages/Users'))
const AdminDashboard = React.lazy(() => import('./Pages/Admin'))
const CrearEvento = React.lazy(() => import('./Pages/CrearEvento'))
const DetallesdeEvento = React.lazy(() => import('./Pages/DetallesDeEvento'))
const MisEventos = React.lazy(() => import('./Pages/MisEventos'))
const Dashboard = React.lazy(() => import('./Pages/dashboard'))
const RetrievePassword = React.lazy(() => import('./Pages/forgot'))
const Register = React.lazy(() => import('./Pages/register'))
const LoginPage = React.lazy(() => import('./Pages/login'))

const App: React.FunctionComponent = (props: any) => {
  const routes = [
    {
      path: '/Tickets',
      name: 'Tickets',
      component: Tickets,
    },
    {
      path: '/Ubicaciones',
      name: 'Ubicaciones',
      component: Ubicaciones,
    },
    {
      path: '/Zonas',
      name: 'Zonas',
      component: Zonas,
    },
    {
      path: '/Eventos',
      name: 'Eventos',
      component: Eventos,
    },
    {
      path: '/Users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/admin',
      name: 'Admin Dashboard',
      component: AdminDashboard,
    },
    {
      path: '/crear-evento',
      name: 'Crear Evento',
      component: CrearEvento,
    },
    {
      path: '/evento/:eventoId',
      name: 'Detalles de Evento',
      component: DetallesdeEvento,
    },
    {
      path: '/mis-eventos',
      name: 'Mis Eventos',
      component: MisEventos,
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/forgot/:nonce?/:email?',
      name: 'Retrieve Password',
      component: RetrievePassword,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/login',
      name: 'Login Page',
      component: LoginPage,
    },
  ]

  const switchRoutes = (
    <Switch>
      {routes.map((prop, key) => {
        return <Route exact path={prop.path} component={prop.component} key={key} />
      })}
    </Switch>
  )

  return (
    <React.Fragment>
      <React.Suspense fallback={<span>Loading</span>}>
        <React.Fragment>{switchRoutes}</React.Fragment>
      </React.Suspense>
    </React.Fragment>
  )
}

export default App
