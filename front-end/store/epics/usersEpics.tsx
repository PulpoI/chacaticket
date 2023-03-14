import axios from 'axios'
import { combineEpics, Epic } from 'redux-observable'
import { catchError, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators'
import {
  addedUsers,
  addingUsers,
  addingUsersFailed,
  editedUsers,
  editingUsers,
  editingUsersFailed,
  foundUsers,
  loadedUsers,
  loadingUsers,
  loadingUsersFailed,
  removedUsersrecord,
  removingUsersrecord,
  removingUsersrecordFailed,
  searchingUsers,
  searchingUsersFailed,
  UsersAction,
  UsersActionTypes,
} from '../actions/usersActions'
import buildFormData from './buildFormData'

import { from, of } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { IState } from '../reducers'

const searchUsersEpic: Epic<UsersAction, UsersAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.SEARCH_USERS)),
    mergeMap((action) => {
      if (typeof action.searchOptions === 'string') {
        action.searchOptions = {
          searchString: action.searchOptions,
          page: 1,
          searchField: '_id',
        }
      }
      let url = `http://127.0.0.1:4567/api/users/search/`
      return from(axios.get(url, { params: action.searchOptions })).pipe(
        map((response) => foundUsers(response.data, action.keep)),
        startWith(searchingUsers()),
        catchError(() => of(searchingUsersFailed()))
      )
    })
  )

const loadUsersEpic: Epic<UsersAction, UsersAction, IState> = (action$, state$) => {
  let responses = []
  return action$.pipe(
    filter(isOfType(UsersActionTypes.LOAD_USERS)),
    switchMap((action) => {
      let url = `http://127.0.0.1:4567/api/users/`
      return from(axios.get(url, { params: action.loadOptions })).pipe(
        map((response) => loadedUsers(response.data)),
        startWith(loadingUsers()),
        catchError(() => of(loadingUsersFailed()))
      )
    })
  )
}

const addUsersEpic: Epic<UsersAction, UsersAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.ADD_USERS)),

    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.post(`http://127.0.0.1:4567/api/users/`, data, config)).pipe(
        map((response) => addedUsers(response.data)),
        startWith(addingUsers()),
        catchError((err) => of(addingUsersFailed(err.response)))
      )
    })
  )

const removeUsersEpic: Epic<UsersAction, UsersAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.REMOVE_USERSRECORD)),
    mergeMap((action) =>
      from(axios.delete(`http://127.0.0.1:4567/api/users/${action.payload._id}`)).pipe(
        map((response) => removedUsersrecord()),
        startWith(removingUsersrecord()),
        catchError(() => of(removingUsersrecordFailed()))
      )
    )
  )

const editUsersEpic: Epic<UsersAction, UsersAction, IState> = (action$, state$) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.EDIT_USERS)),
    mergeMap((action) => {
      const data = new FormData()
      buildFormData(data, action.payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      return from(axios.put(`http://127.0.0.1:4567/api/users/${action.payload._id}`, data, config)).pipe(
        map((response) => editedUsers(response.data)),
        startWith(editingUsers()),
        catchError(() => of(editingUsersFailed()))
      )
    })
  )

export default combineEpics(searchUsersEpic, loadUsersEpic, addUsersEpic, removeUsersEpic, editUsersEpic)
