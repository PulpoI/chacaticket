import { IpaginatedZonas, IZonasItem } from '../models'

export enum ZonasActionTypes {
  SEARCH_ZONAS = 'zonas/search',
  SEARCHING_ZONAS = 'zonas/searching',
  FOUND_ZONAS = 'zonas/found',
  SEARCHING_ZONAS_FAILED = 'zonas/searching_failed',

  LOAD_ZONAS = 'zonas/load',
  LOADING_ZONAS = 'zonas/loading',
  LOADED_ZONAS = 'zonas/loaded',
  LOADING_ZONAS_FAILED = 'zonas/loading_failed',

  ADD_ZONAS = 'zonas/add',
  ADDING_ZONAS = 'zonas/adding',
  ADDED_ZONAS = 'zonas/added',
  ADDING_ZONAS_FAILED = 'zonas/adding_failed',

  REMOVE_ZONA = 'zonas/remove',
  REMOVING_ZONA = 'zonas/removing',
  REMOVED_ZONA = 'zonas/removed',
  REMOVING_ZONA_FAILED = 'zonas/removing_failed',

  EDIT_ZONAS = 'zonas/edit',
  EDITING_ZONAS = 'zonas/editing',
  EDITED_ZONAS = 'zonas/edited',
  EDITING_ZONAS_FAILED = 'zonas/editing_failed',
}

export function searchZonas(searchOptions: TSearchOptions | string, keep?: boolean): ISearchZonasAction {
  return {
    type: ZonasActionTypes.SEARCH_ZONAS,
    searchOptions: typeof searchOptions === 'string' ? { searchString: searchOptions } : searchOptions,
    keep: keep,
  }
}

export function searchingZonas(): ISearchingZonasAction {
  return {
    type: ZonasActionTypes.SEARCHING_ZONAS,
  }
}

export function foundZonas(zonas: IpaginatedZonas, keep?: boolean): IFoundZonasAction {
  return {
    type: ZonasActionTypes.FOUND_ZONAS,
    keep: keep,
    payload: {
      zonas,
    },
  }
}

export function searchingZonasFailed(): ISearchingZonasFailedAction {
  return {
    type: ZonasActionTypes.SEARCHING_ZONAS_FAILED,
  }
}

export function loadZonas(loadOptions: TSearchOptions): ILoadZonasAction {
  return {
    type: ZonasActionTypes.LOAD_ZONAS,
    loadOptions: loadOptions,
  }
}

export function loadingZonas(): ILoadingZonasAction {
  return {
    type: ZonasActionTypes.LOADING_ZONAS,
  }
}

export function loadedZonas(zonas: IpaginatedZonas): ILoadedZonasAction {
  return {
    type: ZonasActionTypes.LOADED_ZONAS,
    payload: {
      zonas,
    },
  }
}

export function loadingZonasFailed(): ILoadingZonasFailedAction {
  return {
    type: ZonasActionTypes.LOADING_ZONAS_FAILED,
  }
}

export function addZonas(zona: IZonasItem): IAddZonasAction {
  return {
    type: ZonasActionTypes.ADD_ZONAS,
    payload: zona,
  }
}

export function addingZonas(): IAddingZonasAction {
  return {
    type: ZonasActionTypes.ADDING_ZONAS,
  }
}

export function addedZonas(zonas: IpaginatedZonas): IAddedZonasAction {
  return {
    type: ZonasActionTypes.ADDED_ZONAS,
    payload: {
      zonas,
    },
  }
}

export function addingZonasFailed(errData: { data: { message: string; field?: string }; status: number }): IAddingZonasFailedAction {
  return {
    type: ZonasActionTypes.ADDING_ZONAS_FAILED,
    message: errData.data.message,
    status: errData.status,
    field: errData.data.field,
  }
}

export function removeZona(zona: IZonasItem): IRemoveZonaAction {
  return {
    type: ZonasActionTypes.REMOVE_ZONA,
    payload: zona,
  }
}

export function removingZona(): IRemovingZonaAction {
  return {
    type: ZonasActionTypes.REMOVING_ZONA,
  }
}

export function removedZona(): IRemovedZonaAction {
  return {
    type: ZonasActionTypes.REMOVED_ZONA,
  }
}

export function removingZonaFailed(): IRemovingZonaFailedAction {
  return {
    type: ZonasActionTypes.REMOVING_ZONA_FAILED,
  }
}

export function editZonas(zona: IZonasItem): IEditZonasAction {
  return {
    type: ZonasActionTypes.EDIT_ZONAS,
    payload: zona,
  }
}

export function editingZonas(): IEditingZonasAction {
  return {
    type: ZonasActionTypes.EDITING_ZONAS,
  }
}

export function editedZonas(zonas: IZonasItem): IEditedZonasAction {
  return {
    type: ZonasActionTypes.EDITED_ZONAS,
    payload: zonas,
  }
}

export function editingZonasFailed(): IEditingZonasFailedAction {
  return {
    type: ZonasActionTypes.EDITING_ZONAS_FAILED,
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

export interface ISearchZonasAction {
  type: ZonasActionTypes.SEARCH_ZONAS
  searchOptions: TSearchOptions
  keep?: boolean
}

export interface ISearchingZonasAction {
  type: ZonasActionTypes.SEARCHING_ZONAS
}

export interface IFoundZonasAction {
  type: ZonasActionTypes.FOUND_ZONAS
  keep?: boolean
  payload: {
    zonas: IpaginatedZonas
  }
}

export interface ISearchingZonasFailedAction {
  type: ZonasActionTypes.SEARCHING_ZONAS_FAILED
}

export interface ILoadZonasAction {
  type: ZonasActionTypes.LOAD_ZONAS
  loadOptions: TSearchOptions
}

export interface ILoadingZonasAction {
  type: ZonasActionTypes.LOADING_ZONAS
}

export interface ILoadedZonasAction {
  type: ZonasActionTypes.LOADED_ZONAS
  payload: {
    zonas: IpaginatedZonas
  }
}

export interface ILoadingZonasFailedAction {
  type: ZonasActionTypes.LOADING_ZONAS_FAILED
}

export interface IAddZonasAction {
  type: ZonasActionTypes.ADD_ZONAS
  payload: IZonasItem
}

export interface IAddingZonasAction {
  type: ZonasActionTypes.ADDING_ZONAS
}

export interface IAddedZonasAction {
  type: ZonasActionTypes.ADDED_ZONAS
  payload: {
    zonas: IpaginatedZonas
  }
}

export interface IAddingZonasFailedAction {
  type: ZonasActionTypes.ADDING_ZONAS_FAILED
  message: string
  status: number
  field?: string
}

export interface IRemoveZonaAction {
  type: ZonasActionTypes.REMOVE_ZONA
  payload: IZonasItem
}

export interface IRemovingZonaAction {
  type: ZonasActionTypes.REMOVING_ZONA
}

export interface IRemovedZonaAction {
  type: ZonasActionTypes.REMOVED_ZONA
}

export interface IRemovingZonaFailedAction {
  type: ZonasActionTypes.REMOVING_ZONA_FAILED
}

export interface IEditZonasAction {
  type: ZonasActionTypes.EDIT_ZONAS
  payload: IZonasItem
}

export interface IEditingZonasAction {
  type: ZonasActionTypes.EDITING_ZONAS
}

export interface IEditedZonasAction {
  type: ZonasActionTypes.EDITED_ZONAS
  payload: IZonasItem
}

export interface IEditingZonasFailedAction {
  type: ZonasActionTypes.EDITING_ZONAS_FAILED
}

export type ZonasAction =
  | ISearchZonasAction
  | ISearchingZonasAction
  | IFoundZonasAction
  | ISearchingZonasFailedAction
  | ILoadZonasAction
  | ILoadingZonasAction
  | ILoadedZonasAction
  | ILoadingZonasFailedAction
  | IAddZonasAction
  | IAddingZonasAction
  | IAddedZonasAction
  | IAddingZonasFailedAction
  | IRemoveZonaAction
  | IRemovingZonaAction
  | IRemovedZonaAction
  | IRemovingZonaFailedAction
  | IEditZonasAction
  | IEditingZonasAction
  | IEditedZonasAction
  | IEditingZonasFailedAction
