import axios from 'axios'
import { combineEpics, Epic } from 'redux-observable'
import { catchError, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators'
import {
  addedTickets,
  addingTickets,
  addingTicketsFailed,
  editedTickets,
  editingTickets,
  editingTicketsFailed,
  foundTickets,
  loadedTickets,
  loadingTickets,
  loadingTicketsFailed,
  removedTicket,
  removingTicket,
  removingTicketFailed,
  searchingTickets,
  searchingTicketsFailed,
  TicketsAction,
  TicketsActionTypes,
} from '../actions/ticketsActions'
import buildFormData from './buildFormData'

import { from, of } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { IState } from '../reducers'

const searchTicketsEpic: Epic<TicketsAction, TicketsAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(TicketsActionTypes.SEARCH_TICKETS)),
    mergeMap((action) => {
      if (typeof action.searchOptions === 'string') {
        action.searchOptions = {
          searchString: action.searchOptions,
          page: 1,
          searchField: '_id',
        }
      }
      let url = `http://127.0.0.1:4567/api/tickets/search/`
      return from(axios.get(url, { params: action.searchOptions })).pipe(
        map((response) => foundTickets(response.data, action.keep)),
        startWith(searchingTickets()),
        catchError(() => of(searchingTicketsFailed()))
      )
    })
  )

const loadTicketsEpic: Epic<TicketsAction, TicketsAction, IState> = (action$, state$) => {
  let responses = []
  return action$.pipe(
    filter(isOfType(TicketsActionTypes.LOAD_TICKETS)),
    switchMap((action) => {
      let url = `http://127.0.0.1:4567/api/tickets/`
      return from(axios.get(url, { params: action.loadOptions })).pipe(
        map((response) => loadedTickets(response.data)),
        startWith(loadingTickets()),
        catchError(() => of(loadingTicketsFailed()))
      )
    })
  )
}

const addTicketsEpic: Epic<TicketsAction, TicketsAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(TicketsActionTypes.ADD_TICKETS)),

    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.post(`http://127.0.0.1:4567/api/tickets/`, data, config)).pipe(
        map((response) => addedTickets(response.data)),
        startWith(addingTickets()),
        catchError((err) => of(addingTicketsFailed(err.response)))
      )
    })
  )

const removeTicketsEpic: Epic<TicketsAction, TicketsAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(TicketsActionTypes.REMOVE_TICKET)),
    mergeMap((action) =>
      from(axios.delete(`http://127.0.0.1:4567/api/tickets/${action.payload._id}`)).pipe(
        map((response) => removedTicket()),
        startWith(removingTicket()),
        catchError(() => of(removingTicketFailed()))
      )
    )
  )

const editTicketsEpic: Epic<TicketsAction, TicketsAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(TicketsActionTypes.EDIT_TICKETS)),
    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.put(`http://127.0.0.1:4567/api/tickets/${action.payload._id}`, data, config)).pipe(
        map((response) => editedTickets(response.data)),
        startWith(editingTickets()),
        catchError(() => of(editingTicketsFailed()))
      )
    })
  )

export default combineEpics(searchTicketsEpic, loadTicketsEpic, addTicketsEpic, removeTicketsEpic, editTicketsEpic)
