import axios from 'axios'
import { combineEpics, Epic } from 'redux-observable'
import { catchError, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators'
import {
  addedAsientos,
  addingAsientos,
  addingAsientosFailed,
  AsientosAction,
  AsientosActionTypes,
  editedAsientos,
  editingAsientos,
  editingAsientosFailed,
  foundAsientos,
  loadedAsientos,
  loadingAsientos,
  loadingAsientosFailed,
  removedAsiento,
  removingAsiento,
  removingAsientoFailed,
  searchingAsientos,
  searchingAsientosFailed,
} from '../actions/asientosActions'
import buildFormData from './buildFormData'

import { from, of } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { IState } from '../reducers'

const searchAsientosEpic: Epic<AsientosAction, AsientosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(AsientosActionTypes.SEARCH_ASIENTOS)),
    mergeMap((action) => {
      if (typeof action.searchOptions === 'string') {
        action.searchOptions = {
          searchString: action.searchOptions,
          page: 1,
          searchField: '_id',
        }
      }
      let url = `http://127.0.0.1:4567/api/asientos/search/`
      return from(axios.get(url, { params: action.searchOptions })).pipe(
        map((response) => foundAsientos(response.data, action.keep)),
        startWith(searchingAsientos()),
        catchError(() => of(searchingAsientosFailed()))
      )
    })
  )

const loadAsientosEpic: Epic<AsientosAction, AsientosAction, IState> = (action$, state$) => {
  let responses = []
  return action$.pipe(
    filter(isOfType(AsientosActionTypes.LOAD_ASIENTOS)),
    switchMap((action) => {
      let url = `http://127.0.0.1:4567/api/asientos/`
      return from(axios.get(url, { params: action.loadOptions })).pipe(
        map((response) => loadedAsientos(response.data)),
        startWith(loadingAsientos()),
        catchError(() => of(loadingAsientosFailed()))
      )
    })
  )
}

const addAsientosEpic: Epic<AsientosAction, AsientosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(AsientosActionTypes.ADD_ASIENTOS)),

    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.post(`http://127.0.0.1:4567/api/asientos/`, data, config)).pipe(
        map((response) => addedAsientos(response.data)),
        startWith(addingAsientos()),
        catchError((err) => of(addingAsientosFailed(err.response)))
      )
    })
  )

const removeAsientosEpic: Epic<AsientosAction, AsientosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(AsientosActionTypes.REMOVE_ASIENTO)),
    mergeMap((action) =>
      from(axios.delete(`http://127.0.0.1:4567/api/asientos/${action.payload._id}`)).pipe(
        map((response) => removedAsiento()),
        startWith(removingAsiento()),
        catchError(() => of(removingAsientoFailed()))
      )
    )
  )

const editAsientosEpic: Epic<AsientosAction, AsientosAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(AsientosActionTypes.EDIT_ASIENTOS)),
    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.put(`http://127.0.0.1:4567/api/asientos/${action.payload._id}`, data, config)).pipe(
        map((response) => editedAsientos(response.data)),
        startWith(editingAsientos()),
        catchError(() => of(editingAsientosFailed()))
      )
    })
  )

export default combineEpics(searchAsientosEpic, loadAsientosEpic, addAsientosEpic, removeAsientosEpic, editAsientosEpic)
