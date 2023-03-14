import { Action } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { IState } from '../reducers'
import eventosEpics from './eventosEpics'
import ticketsEpics from './ticketsEpics'
import ubicacionesEpics from './ubicacionesEpics'
import usersEpics from './usersEpics'
import zonasEpics from './zonasEpics'

export const rootEpic = combineEpics(zonasEpics, ubicacionesEpics, eventosEpics, ticketsEpics, usersEpics)

export default createEpicMiddleware<Action, Action, IState>()
