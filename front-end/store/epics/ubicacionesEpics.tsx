import axios from 'axios'
import { combineEpics, Epic } from 'redux-observable'
import { catchError, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators'
import {
  addedUbicaciones,
  addingUbicaciones,
  addingUbicacionesFailed,
  editedUbicaciones,
  editingUbicaciones,
  editingUbicacionesFailed,
  foundUbicaciones,
  loadedUbicaciones,
  loadingUbicaciones,
  loadingUbicacionesFailed,
  removedUbicacion,
  removingUbicacion,
  removingUbicacionFailed,
  searchingUbicaciones,
  searchingUbicacionesFailed,
  UbicacionesAction,
  UbicacionesActionTypes,
} from '../actions/ubicacionesActions'
import buildFormData from './buildFormData'

import { from, of } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { IState } from '../reducers'

const searchUbicacionesEpic: Epic<UbicacionesAction, UbicacionesAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(UbicacionesActionTypes.SEARCH_UBICACIONES)),
    mergeMap((action) => {
      if (typeof action.searchOptions === 'string') {
        action.searchOptions = {
          searchString: action.searchOptions,
          page: 1,
          searchField: '_id',
        }
      }
      let url = `http://127.0.0.1:4567/api/ubicaciones/search/`
      return from(axios.get(url, { params: action.searchOptions })).pipe(
        map((response) => foundUbicaciones(response.data, action.keep)),
        startWith(searchingUbicaciones()),
        catchError(() => of(searchingUbicacionesFailed()))
      )
    })
  )

const loadUbicacionesEpic: Epic<UbicacionesAction, UbicacionesAction, IState> = (action$, state$) => {
  let responses = []
  return action$.pipe(
    filter(isOfType(UbicacionesActionTypes.LOAD_UBICACIONES)),
    switchMap((action) => {
      let url = `http://127.0.0.1:4567/api/ubicaciones/`
      return from(axios.get(url, { params: action.loadOptions })).pipe(
        map((response) => loadedUbicaciones(response.data)),
        startWith(loadingUbicaciones()),
        catchError(() => of(loadingUbicacionesFailed()))
      )
    })
  )
}

const addUbicacionesEpic: Epic<UbicacionesAction, UbicacionesAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(UbicacionesActionTypes.ADD_UBICACIONES)),

    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.post(`http://127.0.0.1:4567/api/ubicaciones/`, data, config)).pipe(
        map((response) => addedUbicaciones(response.data)),
        startWith(addingUbicaciones()),
        catchError((err) => of(addingUbicacionesFailed(err.response)))
      )
    })
  )

const removeUbicacionesEpic: Epic<UbicacionesAction, UbicacionesAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(UbicacionesActionTypes.REMOVE_UBICACION)),
    mergeMap((action) =>
      from(axios.delete(`http://127.0.0.1:4567/api/ubicaciones/${action.payload._id}`)).pipe(
        map((response) => removedUbicacion()),
        startWith(removingUbicacion()),
        catchError(() => of(removingUbicacionFailed()))
      )
    )
  )

const editUbicacionesEpic: Epic<UbicacionesAction, UbicacionesAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(UbicacionesActionTypes.EDIT_UBICACIONES)),
    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.put(`http://127.0.0.1:4567/api/ubicaciones/${action.payload._id}`, data, config)).pipe(
        map((response) => editedUbicaciones(response.data)),
        startWith(editingUbicaciones()),
        catchError(() => of(editingUbicacionesFailed()))
      )
    })
  )

export default combineEpics(searchUbicacionesEpic, loadUbicacionesEpic, addUbicacionesEpic, removeUbicacionesEpic, editUbicacionesEpic)
