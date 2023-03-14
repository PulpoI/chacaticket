import produce from 'immer'
import { UsersAction, UsersActionTypes } from '../actions/usersActions'
import { ApiStatus, IUsersItem } from '../models'

export const initialUsersState: IUsersState = {
  loadingStatus: ApiStatus.NOTLOADED,
  addingStatus: ApiStatus.NOTLOADED,
  searchingStatus: ApiStatus.NOTLOADED,
  searchString: '',
  users: [],
  foundusers: [],
  totalDocs: 0,
  errMessage: '',
  errStatus: null,
  errField: null,
}

export default function usersReducer(state: IUsersState = initialUsersState, action: UsersAction) {
  return produce(state, (draft) => {
    switch (action.type) {
      case UsersActionTypes.SEARCH_USERS:
        draft.searchString = action.searchOptions.searchString
        break
      case UsersActionTypes.SEARCHING_USERS:
        draft.searchingStatus = ApiStatus.LOADING
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.NOTLOADED
        break

      case UsersActionTypes.SEARCHING_USERS_FAILED:
        draft.searchingStatus = ApiStatus.FAILED
        break

      case UsersActionTypes.FOUND_USERS:
        draft.searchingStatus = ApiStatus.LOADED
        action.keep ? draft.foundusers.push(...action.payload.users.docs) : (draft.foundusers = action.payload.users.docs)
        draft.totalDocs = action.payload.users.totalDocs
        break

      case UsersActionTypes.LOAD_USERS:
      case UsersActionTypes.LOADING_USERS:
        draft.loadingStatus = ApiStatus.LOADING
        draft.addingStatus = ApiStatus.NOTLOADED
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.foundusers = []
        break

      case UsersActionTypes.LOADING_USERS_FAILED:
        draft.loadingStatus = ApiStatus.FAILED
        break

      case UsersActionTypes.LOADED_USERS:
        draft.loadingStatus = ApiStatus.LOADED
        draft.users = action.payload.users.docs
        draft.totalDocs = action.payload.users.totalDocs
        break

      case UsersActionTypes.ADD_USERS:
      case UsersActionTypes.ADDING_USERS:
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.errMessage = ''
        draft.errStatus = null
        draft.errField = null
        break

      case UsersActionTypes.ADDING_USERS_FAILED:
        draft.addingStatus = ApiStatus.FAILED
        draft.errMessage = action.message
        draft.errStatus = action.status
        draft.errField = action.field
        break

      case UsersActionTypes.ADDED_USERS:
        draft.addingStatus = ApiStatus.LOADED
        draft.errStatus = 200
        draft.users.push(action.payload.users.docs[0])
        if (draft.searchString) draft.foundusers.push(action.payload.users.docs[0])
        break

      case UsersActionTypes.REMOVE_USERSRECORD:
        draft.users.splice(
          draft.users.findIndex((usersrecord) => usersrecord._id === action.payload._id),
          1
        )
        break

      case UsersActionTypes.EDIT_USERS:
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.users[draft.users.findIndex((usersrecord) => usersrecord._id === action.payload._id)] = action.payload
        break

      case UsersActionTypes.EDITED_USERS:
        draft.addingStatus = ApiStatus.LOADED
        draft.users[draft.users.findIndex((usersrecord) => usersrecord._id === action.payload._id)] = action.payload
        draft.foundusers[draft.foundusers.findIndex((usersrecord) => usersrecord._id === action.payload._id)] = action.payload
        break
    }
  })
}

export interface IUsersState {
  loadingStatus: ApiStatus
  addingStatus: ApiStatus
  searchingStatus: ApiStatus
  searchString: string
  users: IUsersItem[]
  foundusers: IUsersItem[]
  totalDocs: number
  errMessage?: string
  errStatus?: number
  errField?: string
}
