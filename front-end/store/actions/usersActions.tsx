import { IpaginatedUsers, IUsersItem } from '../models'

export enum UsersActionTypes {
  SEARCH_USERS = 'users/search',
  SEARCHING_USERS = 'users/searching',
  FOUND_USERS = 'users/found',
  SEARCHING_USERS_FAILED = 'users/searching_failed',

  LOAD_USERS = 'users/load',
  LOADING_USERS = 'users/loading',
  LOADED_USERS = 'users/loaded',
  LOADING_USERS_FAILED = 'users/loading_failed',

  ADD_USERS = 'users/add',
  ADDING_USERS = 'users/adding',
  ADDED_USERS = 'users/added',
  ADDING_USERS_FAILED = 'users/adding_failed',

  REMOVE_USERSRECORD = 'users/remove',
  REMOVING_USERSRECORD = 'users/removing',
  REMOVED_USERSRECORD = 'users/removed',
  REMOVING_USERSRECORD_FAILED = 'users/removing_failed',

  EDIT_USERS = 'users/edit',
  EDITING_USERS = 'users/editing',
  EDITED_USERS = 'users/edited',
  EDITING_USERS_FAILED = 'users/editing_failed',
}

export function searchUsers(searchOptions: TSearchOptions | string, keep?: boolean): ISearchUsersAction {
  return {
    type: UsersActionTypes.SEARCH_USERS,
    searchOptions: typeof searchOptions === 'string' ? { searchString: searchOptions } : searchOptions,
    keep: keep,
  }
}

export function searchingUsers(): ISearchingUsersAction {
  return {
    type: UsersActionTypes.SEARCHING_USERS,
  }
}

export function foundUsers(users: IpaginatedUsers, keep?: boolean): IFoundUsersAction {
  return {
    type: UsersActionTypes.FOUND_USERS,
    keep: keep,
    payload: {
      users,
    },
  }
}

export function searchingUsersFailed(): ISearchingUsersFailedAction {
  return {
    type: UsersActionTypes.SEARCHING_USERS_FAILED,
  }
}

export function loadUsers(loadOptions: TSearchOptions): ILoadUsersAction {
  return {
    type: UsersActionTypes.LOAD_USERS,
    loadOptions: loadOptions,
  }
}

export function loadingUsers(): ILoadingUsersAction {
  return {
    type: UsersActionTypes.LOADING_USERS,
  }
}

export function loadedUsers(users: IpaginatedUsers): ILoadedUsersAction {
  return {
    type: UsersActionTypes.LOADED_USERS,
    payload: {
      users,
    },
  }
}

export function loadingUsersFailed(): ILoadingUsersFailedAction {
  return {
    type: UsersActionTypes.LOADING_USERS_FAILED,
  }
}

export function addUsers(usersrecord: IUsersItem): IAddUsersAction {
  return {
    type: UsersActionTypes.ADD_USERS,
    payload: usersrecord,
  }
}

export function addingUsers(): IAddingUsersAction {
  return {
    type: UsersActionTypes.ADDING_USERS,
  }
}

export function addedUsers(users: IpaginatedUsers): IAddedUsersAction {
  return {
    type: UsersActionTypes.ADDED_USERS,
    payload: {
      users,
    },
  }
}

export function addingUsersFailed(errData: { data: { message: string; field?: string }; status: number }): IAddingUsersFailedAction {
  return {
    type: UsersActionTypes.ADDING_USERS_FAILED,
    message: errData.data.message,
    status: errData.status,
    field: errData.data.field,
  }
}

export function removeUsersrecord(usersrecord: IUsersItem): IRemoveUsersrecordAction {
  return {
    type: UsersActionTypes.REMOVE_USERSRECORD,
    payload: usersrecord,
  }
}

export function removingUsersrecord(): IRemovingUsersrecordAction {
  return {
    type: UsersActionTypes.REMOVING_USERSRECORD,
  }
}

export function removedUsersrecord(): IRemovedUsersrecordAction {
  return {
    type: UsersActionTypes.REMOVED_USERSRECORD,
  }
}

export function removingUsersrecordFailed(): IRemovingUsersrecordFailedAction {
  return {
    type: UsersActionTypes.REMOVING_USERSRECORD_FAILED,
  }
}

export function editUsers(usersrecord: IUsersItem): IEditUsersAction {
  return {
    type: UsersActionTypes.EDIT_USERS,
    payload: usersrecord,
  }
}

export function editingUsers(): IEditingUsersAction {
  return {
    type: UsersActionTypes.EDITING_USERS,
  }
}

export function editedUsers(users: IUsersItem): IEditedUsersAction {
  return {
    type: UsersActionTypes.EDITED_USERS,
    payload: users,
  }
}

export function editingUsersFailed(): IEditingUsersFailedAction {
  return {
    type: UsersActionTypes.EDITING_USERS_FAILED,
  }
}

type TSearchOptions = {
  searchString?: string
  searchField?: string
  page?: number
  limit?: number
  populate?: boolean
  sort?: {
    field: string
    method?: 'asc' | 'desc'
  }
  filters?: { field: string; value: string }[]
}

export interface ISearchUsersAction {
  type: UsersActionTypes.SEARCH_USERS
  searchOptions: TSearchOptions
  keep?: boolean
}

export interface ISearchingUsersAction {
  type: UsersActionTypes.SEARCHING_USERS
}

export interface IFoundUsersAction {
  type: UsersActionTypes.FOUND_USERS
  keep?: boolean
  payload: {
    users: IpaginatedUsers
  }
}

export interface ISearchingUsersFailedAction {
  type: UsersActionTypes.SEARCHING_USERS_FAILED
}

export interface ILoadUsersAction {
  type: UsersActionTypes.LOAD_USERS
  loadOptions: TSearchOptions
}

export interface ILoadingUsersAction {
  type: UsersActionTypes.LOADING_USERS
}

export interface ILoadedUsersAction {
  type: UsersActionTypes.LOADED_USERS
  payload: {
    users: IpaginatedUsers
  }
}

export interface ILoadingUsersFailedAction {
  type: UsersActionTypes.LOADING_USERS_FAILED
}

export interface IAddUsersAction {
  type: UsersActionTypes.ADD_USERS
  payload: IUsersItem
}

export interface IAddingUsersAction {
  type: UsersActionTypes.ADDING_USERS
}

export interface IAddedUsersAction {
  type: UsersActionTypes.ADDED_USERS
  payload: {
    users: IpaginatedUsers
  }
}

export interface IAddingUsersFailedAction {
  type: UsersActionTypes.ADDING_USERS_FAILED
  message: string
  status: number
  field?: string
}

export interface IRemoveUsersrecordAction {
  type: UsersActionTypes.REMOVE_USERSRECORD
  payload: IUsersItem
}

export interface IRemovingUsersrecordAction {
  type: UsersActionTypes.REMOVING_USERSRECORD
}

export interface IRemovedUsersrecordAction {
  type: UsersActionTypes.REMOVED_USERSRECORD
}

export interface IRemovingUsersrecordFailedAction {
  type: UsersActionTypes.REMOVING_USERSRECORD_FAILED
}

export interface IEditUsersAction {
  type: UsersActionTypes.EDIT_USERS
  payload: IUsersItem
}

export interface IEditingUsersAction {
  type: UsersActionTypes.EDITING_USERS
}

export interface IEditedUsersAction {
  type: UsersActionTypes.EDITED_USERS
  payload: IUsersItem
}

export interface IEditingUsersFailedAction {
  type: UsersActionTypes.EDITING_USERS_FAILED
}

export type UsersAction =
  | ISearchUsersAction
  | ISearchingUsersAction
  | IFoundUsersAction
  | ISearchingUsersFailedAction
  | ILoadUsersAction
  | ILoadingUsersAction
  | ILoadedUsersAction
  | ILoadingUsersFailedAction
  | IAddUsersAction
  | IAddingUsersAction
  | IAddedUsersAction
  | IAddingUsersFailedAction
  | IRemoveUsersrecordAction
  | IRemovingUsersrecordAction
  | IRemovedUsersrecordAction
  | IRemovingUsersrecordFailedAction
  | IEditUsersAction
  | IEditingUsersAction
  | IEditedUsersAction
  | IEditingUsersFailedAction
