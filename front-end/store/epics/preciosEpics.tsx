import axios from 'axios'
import { combineEpics, Epic } from 'redux-observable'
import { catchError, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators'
import {
  addedPrecios,
  addingPrecios,
  addingPreciosFailed,
  editedPrecios,
  editingPrecios,
  editingPreciosFailed,
  foundPrecios,
  loadedPrecios,
  loadingPrecios,
  loadingPreciosFailed,
  PreciosAction,
  PreciosActionTypes,
  removedPrecio,
  removingPrecio,
  removingPrecioFailed,
  searchingPrecios,
  searchingPreciosFailed,
} from '../actions/preciosActions'
import buildFormData from './buildFormData'

import { from, of } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { IState } from '../reducers'

const searchPreciosEpic: Epic<PreciosAction, PreciosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(PreciosActionTypes.SEARCH_PRECIOS)),
    mergeMap((action) => {
      if (typeof action.searchOptions === 'string') {
        action.searchOptions = {
          searchString: action.searchOptions,
          page: 1,
          searchField: '_id',
        }
      }
      let url = `http://127.0.0.1:4567/api/precios/search/`
      return from(axios.get(url, { params: action.searchOptions })).pipe(
        map((response) => foundPrecios(response.data, action.keep)),
        startWith(searchingPrecios()),
        catchError(() => of(searchingPreciosFailed()))
      )
    })
  )

const loadPreciosEpic: Epic<PreciosAction, PreciosAction, IState> = (action$, state$) => {
  let responses = []
  return action$.pipe(
    filter(isOfType(PreciosActionTypes.LOAD_PRECIOS)),
    switchMap((action) => {
      let url = `http://127.0.0.1:4567/api/precios/`
      return from(axios.get(url, { params: action.loadOptions })).pipe(
        map((response) => loadedPrecios(response.data)),
        startWith(loadingPrecios()),
        catchError(() => of(loadingPreciosFailed()))
      )
    })
  )
}

const addPreciosEpic: Epic<PreciosAction, PreciosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(PreciosActionTypes.ADD_PRECIOS)),

    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.post(`http://127.0.0.1:4567/api/precios/`, data, config)).pipe(
        map((response) => addedPrecios(response.data)),
        startWith(addingPrecios()),
        catchError((err) => of(addingPreciosFailed(err.response)))
      )
    })
  )

const removePreciosEpic: Epic<PreciosAction, PreciosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(PreciosActionTypes.REMOVE_PRECIO)),
    mergeMap((action) =>
      from(axios.delete(`http://127.0.0.1:4567/api/precios/${action.payload._id}`)).pipe(
        map((response) => removedPrecio()),
        startWith(removingPrecio()),
        catchError(() => of(removingPrecioFailed()))
      )
    )
  )

const editPreciosEpic: Epic<PreciosAction, PreciosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(PreciosActionTypes.EDIT_PRECIOS)),
    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.put(`http://127.0.0.1:4567/api/precios/${action.payload._id}`, data, config)).pipe(
        map((response) => editedPrecios(response.data)),
        startWith(editingPrecios()),
        catchError(() => of(editingPreciosFailed()))
      )
    })
  )

export default combineEpics(searchPreciosEpic, loadPreciosEpic, addPreciosEpic, removePreciosEpic, editPreciosEpic)
