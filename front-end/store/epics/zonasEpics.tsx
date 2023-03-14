import axios from 'axios'
import { combineEpics, Epic } from 'redux-observable'
import { catchError, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators'
import {
  addedZonas,
  addingZonas,
  addingZonasFailed,
  editedZonas,
  editingZonas,
  editingZonasFailed,
  foundZonas,
  loadedZonas,
  loadingZonas,
  loadingZonasFailed,
  removedZona,
  removingZona,
  removingZonaFailed,
  searchingZonas,
  searchingZonasFailed,
  ZonasAction,
  ZonasActionTypes,
} from '../actions/zonasActions'
import buildFormData from './buildFormData'

import { from, of } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { IState } from '../reducers'

const searchZonasEpic: Epic<ZonasAction, ZonasAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(ZonasActionTypes.SEARCH_ZONAS)),
    mergeMap((action) => {
      if (typeof action.searchOptions === 'string') {
        action.searchOptions = {
          searchString: action.searchOptions,
          page: 1,
          searchField: '_id',
        }
      }
      let url = `http://127.0.0.1:4567/api/zonas/search/`
      return from(axios.get(url, { params: action.searchOptions })).pipe(
        map((response) => foundZonas(response.data, action.keep)),
        startWith(searchingZonas()),
        catchError(() => of(searchingZonasFailed()))
      )
    })
  )

const loadZonasEpic: Epic<ZonasAction, ZonasAction, IState> = (action$, state$) => {
  let responses = []
  return action$.pipe(
    filter(isOfType(ZonasActionTypes.LOAD_ZONAS)),
    switchMap((action) => {
      let url = `http://127.0.0.1:4567/api/zonas/`
      return from(axios.get(url, { params: action.loadOptions })).pipe(
        map((response) => loadedZonas(response.data)),
        startWith(loadingZonas()),
        catchError(() => of(loadingZonasFailed()))
      )
    })
  )
}

const addZonasEpic: Epic<ZonasAction, ZonasAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(ZonasActionTypes.ADD_ZONAS)),

    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.post(`http://127.0.0.1:4567/api/zonas/`, data, config)).pipe(
        map((response) => addedZonas(response.data)),
        startWith(addingZonas()),
        catchError((err) => of(addingZonasFailed(err.response)))
      )
    })
  )

const removeZonasEpic: Epic<ZonasAction, ZonasAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(ZonasActionTypes.REMOVE_ZONA)),
    mergeMap((action) =>
      from(axios.delete(`http://127.0.0.1:4567/api/zonas/${action.payload._id}`)).pipe(
        map((response) => removedZona()),
        startWith(removingZona()),
        catchError(() => of(removingZonaFailed()))
      )
    )
  )

const editZonasEpic: Epic<ZonasAction, ZonasAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(ZonasActionTypes.EDIT_ZONAS)),
    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.put(`http://127.0.0.1:4567/api/zonas/${action.payload._id}`, data, config)).pipe(
        map((response) => editedZonas(response.data)),
        startWith(editingZonas()),
        catchError(() => of(editingZonasFailed()))
      )
    })
  )

export default combineEpics(searchZonasEpic, loadZonasEpic, addZonasEpic, removeZonasEpic, editZonasEpic)
