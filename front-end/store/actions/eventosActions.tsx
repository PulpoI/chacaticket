import { IEventosItem, IpaginatedEventos } from '../models'

export enum EventosActionTypes {
  SEARCH_EVENTOS = 'eventos/search',
  SEARCHING_EVENTOS = 'eventos/searching',
  FOUND_EVENTOS = 'eventos/found',
  SEARCHING_EVENTOS_FAILED = 'eventos/searching_failed',

  LOAD_EVENTOS = 'eventos/load',
  LOADING_EVENTOS = 'eventos/loading',
  LOADED_EVENTOS = 'eventos/loaded',
  LOADING_EVENTOS_FAILED = 'eventos/loading_failed',

  ADD_EVENTOS = 'eventos/add',
  ADDING_EVENTOS = 'eventos/adding',
  ADDED_EVENTOS = 'eventos/added',
  ADDING_EVENTOS_FAILED = 'eventos/adding_failed',

  REMOVE_EVENTO = 'eventos/remove',
  REMOVING_EVENTO = 'eventos/removing',
  REMOVED_EVENTO = 'eventos/removed',
  REMOVING_EVENTO_FAILED = 'eventos/removing_failed',

  EDIT_EVENTOS = 'eventos/edit',
  EDITING_EVENTOS = 'eventos/editing',
  EDITED_EVENTOS = 'eventos/edited',
  EDITING_EVENTOS_FAILED = 'eventos/editing_failed',
}

export function searchEventos(searchOptions: TSearchOptions | string, keep?: boolean): ISearchEventosAction {
  return {
    type: EventosActionTypes.SEARCH_EVENTOS,
    searchOptions: typeof searchOptions === 'string' ? { searchString: searchOptions } : searchOptions,
    keep: keep,
  }
}

export function searchingEventos(): ISearchingEventosAction {
  return {
    type: EventosActionTypes.SEARCHING_EVENTOS,
  }
}

export function foundEventos(eventos: IpaginatedEventos, keep?: boolean): IFoundEventosAction {
  return {
    type: EventosActionTypes.FOUND_EVENTOS,
    keep: keep,
    payload: {
      eventos,
    },
  }
}

export function searchingEventosFailed(): ISearchingEventosFailedAction {
  return {
    type: EventosActionTypes.SEARCHING_EVENTOS_FAILED,
  }
}

export function loadEventos(loadOptions: TSearchOptions): ILoadEventosAction {
  return {
    type: EventosActionTypes.LOAD_EVENTOS,
    loadOptions: loadOptions,
  }
}

export function loadingEventos(): ILoadingEventosAction {
  return {
    type: EventosActionTypes.LOADING_EVENTOS,
  }
}

export function loadedEventos(eventos: IpaginatedEventos): ILoadedEventosAction {
  return {
    type: EventosActionTypes.LOADED_EVENTOS,
    payload: {
      eventos,
    },
  }
}

export function loadingEventosFailed(): ILoadingEventosFailedAction {
  return {
    type: EventosActionTypes.LOADING_EVENTOS_FAILED,
  }
}

export function addEventos(evento: IEventosItem): IAddEventosAction {
  return {
    type: EventosActionTypes.ADD_EVENTOS,
    payload: evento,
  }
}

export function addingEventos(): IAddingEventosAction {
  return {
    type: EventosActionTypes.ADDING_EVENTOS,
  }
}

export function addedEventos(eventos: IpaginatedEventos): IAddedEventosAction {
  return {
    type: EventosActionTypes.ADDED_EVENTOS,
    payload: {
      eventos,
    },
  }
}

export function addingEventosFailed(errData: { data: { message: string; field?: string }; status: number }): IAddingEventosFailedAction {
  return {
    type: EventosActionTypes.ADDING_EVENTOS_FAILED,
    message: errData.data.message,
    status: errData.status,
    field: errData.data.field,
  }
}

export function removeEvento(evento: IEventosItem): IRemoveEventoAction {
  return {
    type: EventosActionTypes.REMOVE_EVENTO,
    payload: evento,
  }
}

export function removingEvento(): IRemovingEventoAction {
  return {
    type: EventosActionTypes.REMOVING_EVENTO,
  }
}

export function removedEvento(): IRemovedEventoAction {
  return {
    type: EventosActionTypes.REMOVED_EVENTO,
  }
}

export function removingEventoFailed(): IRemovingEventoFailedAction {
  return {
    type: EventosActionTypes.REMOVING_EVENTO_FAILED,
  }
}

export function editEventos(evento: IEventosItem): IEditEventosAction {
  return {
    type: EventosActionTypes.EDIT_EVENTOS,
    payload: evento,
  }
}

export function editingEventos(): IEditingEventosAction {
  return {
    type: EventosActionTypes.EDITING_EVENTOS,
  }
}

export function editedEventos(eventos: IEventosItem): IEditedEventosAction {
  return {
    type: EventosActionTypes.EDITED_EVENTOS,
    payload: eventos,
  }
}

export function editingEventosFailed(): IEditingEventosFailedAction {
  return {
    type: EventosActionTypes.EDITING_EVENTOS_FAILED,
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

export interface ISearchEventosAction {
  type: EventosActionTypes.SEARCH_EVENTOS
  searchOptions: TSearchOptions
  keep?: boolean
}

export interface ISearchingEventosAction {
  type: EventosActionTypes.SEARCHING_EVENTOS
}

export interface IFoundEventosAction {
  type: EventosActionTypes.FOUND_EVENTOS
  keep?: boolean
  payload: {
    eventos: IpaginatedEventos
  }
}

export interface ISearchingEventosFailedAction {
  type: EventosActionTypes.SEARCHING_EVENTOS_FAILED
}

export interface ILoadEventosAction {
  type: EventosActionTypes.LOAD_EVENTOS
  loadOptions: TSearchOptions
}

export interface ILoadingEventosAction {
  type: EventosActionTypes.LOADING_EVENTOS
}

export interface ILoadedEventosAction {
  type: EventosActionTypes.LOADED_EVENTOS
  payload: {
    eventos: IpaginatedEventos
  }
}

export interface ILoadingEventosFailedAction {
  type: EventosActionTypes.LOADING_EVENTOS_FAILED
}

export interface IAddEventosAction {
  type: EventosActionTypes.ADD_EVENTOS
  payload: IEventosItem
}

export interface IAddingEventosAction {
  type: EventosActionTypes.ADDING_EVENTOS
}

export interface IAddedEventosAction {
  type: EventosActionTypes.ADDED_EVENTOS
  payload: {
    eventos: IpaginatedEventos
  }
}

export interface IAddingEventosFailedAction {
  type: EventosActionTypes.ADDING_EVENTOS_FAILED
  message: string
  status: number
  field?: string
}

export interface IRemoveEventoAction {
  type: EventosActionTypes.REMOVE_EVENTO
  payload: IEventosItem
}

export interface IRemovingEventoAction {
  type: EventosActionTypes.REMOVING_EVENTO
}

export interface IRemovedEventoAction {
  type: EventosActionTypes.REMOVED_EVENTO
}

export interface IRemovingEventoFailedAction {
  type: EventosActionTypes.REMOVING_EVENTO_FAILED
}

export interface IEditEventosAction {
  type: EventosActionTypes.EDIT_EVENTOS
  payload: IEventosItem
}

export interface IEditingEventosAction {
  type: EventosActionTypes.EDITING_EVENTOS
}

export interface IEditedEventosAction {
  type: EventosActionTypes.EDITED_EVENTOS
  payload: IEventosItem
}

export interface IEditingEventosFailedAction {
  type: EventosActionTypes.EDITING_EVENTOS_FAILED
}

export type EventosAction =
  | ISearchEventosAction
  | ISearchingEventosAction
  | IFoundEventosAction
  | ISearchingEventosFailedAction
  | ILoadEventosAction
  | ILoadingEventosAction
  | ILoadedEventosAction
  | ILoadingEventosFailedAction
  | IAddEventosAction
  | IAddingEventosAction
  | IAddedEventosAction
  | IAddingEventosFailedAction
  | IRemoveEventoAction
  | IRemovingEventoAction
  | IRemovedEventoAction
  | IRemovingEventoFailedAction
  | IEditEventosAction
  | IEditingEventosAction
  | IEditedEventosAction
  | IEditingEventosFailedAction
