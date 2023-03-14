import axios from 'axios'
import { combineEpics, Epic } from 'redux-observable'
import { catchError, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators'
import {
  addedEventos,
  addingEventos,
  addingEventosFailed,
  editedEventos,
  editingEventos,
  editingEventosFailed,
  EventosAction,
  EventosActionTypes,
  foundEventos,
  loadedEventos,
  loadingEventos,
  loadingEventosFailed,
  removedEvento,
  removingEvento,
  removingEventoFailed,
  searchingEventos,
  searchingEventosFailed,
} from '../actions/eventosActions'
import buildFormData from './buildFormData'

import { from, of } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { IState } from '../reducers'

const searchEventosEpic: Epic<EventosAction, EventosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(EventosActionTypes.SEARCH_EVENTOS)),
    mergeMap((action) => {
      if (typeof action.searchOptions === 'string') {
        action.searchOptions = {
          searchString: action.searchOptions,
          page: 1,
          searchField: '_id',
        }
      }
      let url = `http://127.0.0.1:4567/api/eventos/search/`
      return from(axios.get(url, { params: action.searchOptions })).pipe(
        map((response) => foundEventos(response.data, action.keep)),
        startWith(searchingEventos()),
        catchError(() => of(searchingEventosFailed()))
      )
    })
  )

const loadEventosEpic: Epic<EventosAction, EventosAction, IState> = (action$, state$) => {
  let responses = []
  return action$.pipe(
    filter(isOfType(EventosActionTypes.LOAD_EVENTOS)),
    switchMap((action) => {
      let url = `http://127.0.0.1:4567/api/eventos/`
      return from(axios.get(url, { params: action.loadOptions })).pipe(
        map((response) => loadedEventos(response.data)),
        startWith(loadingEventos()),
        catchError(() => of(loadingEventosFailed()))
      )
    })
  )
}

const addEventosEpic: Epic<EventosAction, EventosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(EventosActionTypes.ADD_EVENTOS)),

    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.post(`http://127.0.0.1:4567/api/eventos/`, data, config)).pipe(
        map((response) => addedEventos(response.data)),
        startWith(addingEventos()),
        catchError((err) => of(addingEventosFailed(err.response)))
      )
    })
  )

const removeEventosEpic: Epic<EventosAction, EventosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(EventosActionTypes.REMOVE_EVENTO)),
    mergeMap((action) =>
      from(axios.delete(`http://127.0.0.1:4567/api/eventos/${action.payload._id}`)).pipe(
        map((response) => removedEvento()),
        startWith(removingEvento()),
        catchError(() => of(removingEventoFailed()))
      )
    )
  )

const editEventosEpic: Epic<EventosAction, EventosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(EventosActionTypes.EDIT_EVENTOS)),
    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.put(`http://127.0.0.1:4567/api/eventos/${action.payload._id}`, data, config)).pipe(
        map((response) => editedEventos(response.data)),
        startWith(editingEventos()),
        catchError(() => of(editingEventosFailed()))
      )
    })
  )

export default combineEpics(searchEventosEpic, loadEventosEpic, addEventosEpic, removeEventosEpic, editEventosEpic)
