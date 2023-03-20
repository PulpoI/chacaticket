import { combineReducers } from 'redux'

import eventosReducer, { IEventosState, initialEventosState } from './eventosReducer'
import ticketsReducer, { initialTicketsState, ITicketsState } from './ticketsReducer'
import usersReducer, { initialUsersState, IUsersState } from './usersReducer'
import zonasReducer, { initialZonasState, IZonasState } from './zonasReducer'

export interface IState {
  zonas: IZonasState
  eventos: IEventosState
  tickets: ITicketsState
  users: IUsersState
}

export const initialState: IState = {
  zonas: initialZonasState,
  eventos: initialEventosState,
  tickets: initialTicketsState,
  users: initialUsersState,
}

export default combineReducers({
  zonas: zonasReducer,
  eventos: eventosReducer,
  tickets: ticketsReducer,
  users: usersReducer,
})
