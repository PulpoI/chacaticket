import { IpaginatedUbicaciones, IUbicacionesItem } from '../models'

export enum UbicacionesActionTypes {
  SEARCH_UBICACIONES = 'ubicaciones/search',
  SEARCHING_UBICACIONES = 'ubicaciones/searching',
  FOUND_UBICACIONES = 'ubicaciones/found',
  SEARCHING_UBICACIONES_FAILED = 'ubicaciones/searching_failed',

  LOAD_UBICACIONES = 'ubicaciones/load',
  LOADING_UBICACIONES = 'ubicaciones/loading',
  LOADED_UBICACIONES = 'ubicaciones/loaded',
  LOADING_UBICACIONES_FAILED = 'ubicaciones/loading_failed',

  ADD_UBICACIONES = 'ubicaciones/add',
  ADDING_UBICACIONES = 'ubicaciones/adding',
  ADDED_UBICACIONES = 'ubicaciones/added',
  ADDING_UBICACIONES_FAILED = 'ubicaciones/adding_failed',

  REMOVE_UBICACION = 'ubicaciones/remove',
  REMOVING_UBICACION = 'ubicaciones/removing',
  REMOVED_UBICACION = 'ubicaciones/removed',
  REMOVING_UBICACION_FAILED = 'ubicaciones/removing_failed',

  EDIT_UBICACIONES = 'ubicaciones/edit',
  EDITING_UBICACIONES = 'ubicaciones/editing',
  EDITED_UBICACIONES = 'ubicaciones/edited',
  EDITING_UBICACIONES_FAILED = 'ubicaciones/editing_failed',
}

export function searchUbicaciones(searchOptions: TSearchOptions | string, keep?: boolean): ISearchUbicacionesAction {
  return {
    type: UbicacionesActionTypes.SEARCH_UBICACIONES,
    searchOptions: typeof searchOptions === 'string' ? { searchString: searchOptions } : searchOptions,
    keep: keep,
  }
}

export function searchingUbicaciones(): ISearchingUbicacionesAction {
  return {
    type: UbicacionesActionTypes.SEARCHING_UBICACIONES,
  }
}

export function foundUbicaciones(ubicaciones: IpaginatedUbicaciones, keep?: boolean): IFoundUbicacionesAction {
  return {
    type: UbicacionesActionTypes.FOUND_UBICACIONES,
    keep: keep,
    payload: {
      ubicaciones,
    },
  }
}

export function searchingUbicacionesFailed(): ISearchingUbicacionesFailedAction {
  return {
    type: UbicacionesActionTypes.SEARCHING_UBICACIONES_FAILED,
  }
}

export function loadUbicaciones(loadOptions: TSearchOptions): ILoadUbicacionesAction {
  return {
    type: UbicacionesActionTypes.LOAD_UBICACIONES,
    loadOptions: loadOptions,
  }
}

export function loadingUbicaciones(): ILoadingUbicacionesAction {
  return {
    type: UbicacionesActionTypes.LOADING_UBICACIONES,
  }
}

export function loadedUbicaciones(ubicaciones: IpaginatedUbicaciones): ILoadedUbicacionesAction {
  return {
    type: UbicacionesActionTypes.LOADED_UBICACIONES,
    payload: {
      ubicaciones,
    },
  }
}

export function loadingUbicacionesFailed(): ILoadingUbicacionesFailedAction {
  return {
    type: UbicacionesActionTypes.LOADING_UBICACIONES_FAILED,
  }
}

export function addUbicaciones(ubicacion: IUbicacionesItem): IAddUbicacionesAction {
  return {
    type: UbicacionesActionTypes.ADD_UBICACIONES,
    payload: ubicacion,
  }
}

export function addingUbicaciones(): IAddingUbicacionesAction {
  return {
    type: UbicacionesActionTypes.ADDING_UBICACIONES,
  }
}

export function addedUbicaciones(ubicaciones: IpaginatedUbicaciones): IAddedUbicacionesAction {
  return {
    type: UbicacionesActionTypes.ADDED_UBICACIONES,
    payload: {
      ubicaciones,
    },
  }
}

export function addingUbicacionesFailed(errData: { data: { message: string; field?: string }; status: number }): IAddingUbicacionesFailedAction {
  return {
    type: UbicacionesActionTypes.ADDING_UBICACIONES_FAILED,
    message: errData.data.message,
    status: errData.status,
    field: errData.data.field,
  }
}

export function removeUbicacion(ubicacion: IUbicacionesItem): IRemoveUbicacionAction {
  return {
    type: UbicacionesActionTypes.REMOVE_UBICACION,
    payload: ubicacion,
  }
}

export function removingUbicacion(): IRemovingUbicacionAction {
  return {
    type: UbicacionesActionTypes.REMOVING_UBICACION,
  }
}

export function removedUbicacion(): IRemovedUbicacionAction {
  return {
    type: UbicacionesActionTypes.REMOVED_UBICACION,
  }
}

export function removingUbicacionFailed(): IRemovingUbicacionFailedAction {
  return {
    type: UbicacionesActionTypes.REMOVING_UBICACION_FAILED,
  }
}

export function editUbicaciones(ubicacion: IUbicacionesItem): IEditUbicacionesAction {
  return {
    type: UbicacionesActionTypes.EDIT_UBICACIONES,
    payload: ubicacion,
  }
}

export function editingUbicaciones(): IEditingUbicacionesAction {
  return {
    type: UbicacionesActionTypes.EDITING_UBICACIONES,
  }
}

export function editedUbicaciones(ubicaciones: IUbicacionesItem): IEditedUbicacionesAction {
  return {
    type: UbicacionesActionTypes.EDITED_UBICACIONES,
    payload: ubicaciones,
  }
}

export function editingUbicacionesFailed(): IEditingUbicacionesFailedAction {
  return {
    type: UbicacionesActionTypes.EDITING_UBICACIONES_FAILED,
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

export interface ISearchUbicacionesAction {
  type: UbicacionesActionTypes.SEARCH_UBICACIONES
  searchOptions: TSearchOptions
  keep?: boolean
}

export interface ISearchingUbicacionesAction {
  type: UbicacionesActionTypes.SEARCHING_UBICACIONES
}

export interface IFoundUbicacionesAction {
  type: UbicacionesActionTypes.FOUND_UBICACIONES
  keep?: boolean
  payload: {
    ubicaciones: IpaginatedUbicaciones
  }
}

export interface ISearchingUbicacionesFailedAction {
  type: UbicacionesActionTypes.SEARCHING_UBICACIONES_FAILED
}

export interface ILoadUbicacionesAction {
  type: UbicacionesActionTypes.LOAD_UBICACIONES
  loadOptions: TSearchOptions
}

export interface ILoadingUbicacionesAction {
  type: UbicacionesActionTypes.LOADING_UBICACIONES
}

export interface ILoadedUbicacionesAction {
  type: UbicacionesActionTypes.LOADED_UBICACIONES
  payload: {
    ubicaciones: IpaginatedUbicaciones
  }
}

export interface ILoadingUbicacionesFailedAction {
  type: UbicacionesActionTypes.LOADING_UBICACIONES_FAILED
}

export interface IAddUbicacionesAction {
  type: UbicacionesActionTypes.ADD_UBICACIONES
  payload: IUbicacionesItem
}

export interface IAddingUbicacionesAction {
  type: UbicacionesActionTypes.ADDING_UBICACIONES
}

export interface IAddedUbicacionesAction {
  type: UbicacionesActionTypes.ADDED_UBICACIONES
  payload: {
    ubicaciones: IpaginatedUbicaciones
  }
}

export interface IAddingUbicacionesFailedAction {
  type: UbicacionesActionTypes.ADDING_UBICACIONES_FAILED
  message: string
  status: number
  field?: string
}

export interface IRemoveUbicacionAction {
  type: UbicacionesActionTypes.REMOVE_UBICACION
  payload: IUbicacionesItem
}

export interface IRemovingUbicacionAction {
  type: UbicacionesActionTypes.REMOVING_UBICACION
}

export interface IRemovedUbicacionAction {
  type: UbicacionesActionTypes.REMOVED_UBICACION
}

export interface IRemovingUbicacionFailedAction {
  type: UbicacionesActionTypes.REMOVING_UBICACION_FAILED
}

export interface IEditUbicacionesAction {
  type: UbicacionesActionTypes.EDIT_UBICACIONES
  payload: IUbicacionesItem
}

export interface IEditingUbicacionesAction {
  type: UbicacionesActionTypes.EDITING_UBICACIONES
}

export interface IEditedUbicacionesAction {
  type: UbicacionesActionTypes.EDITED_UBICACIONES
  payload: IUbicacionesItem
}

export interface IEditingUbicacionesFailedAction {
  type: UbicacionesActionTypes.EDITING_UBICACIONES_FAILED
}

export type UbicacionesAction =
  | ISearchUbicacionesAction
  | ISearchingUbicacionesAction
  | IFoundUbicacionesAction
  | ISearchingUbicacionesFailedAction
  | ILoadUbicacionesAction
  | ILoadingUbicacionesAction
  | ILoadedUbicacionesAction
  | ILoadingUbicacionesFailedAction
  | IAddUbicacionesAction
  | IAddingUbicacionesAction
  | IAddedUbicacionesAction
  | IAddingUbicacionesFailedAction
  | IRemoveUbicacionAction
  | IRemovingUbicacionAction
  | IRemovedUbicacionAction
  | IRemovingUbicacionFailedAction
  | IEditUbicacionesAction
  | IEditingUbicacionesAction
  | IEditedUbicacionesAction
  | IEditingUbicacionesFailedAction
