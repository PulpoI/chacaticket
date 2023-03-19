// import { IpaginatedPrecios, IPreciosItem } from '../models'

// export enum PreciosActionTypes {
//   SEARCH_PRECIOS = 'precios/search',
//   SEARCHING_PRECIOS = 'precios/searching',
//   FOUND_PRECIOS = 'precios/found',
//   SEARCHING_PRECIOS_FAILED = 'precios/searching_failed',

//   LOAD_PRECIOS = 'precios/load',
//   LOADING_PRECIOS = 'precios/loading',
//   LOADED_PRECIOS = 'precios/loaded',
//   LOADING_PRECIOS_FAILED = 'precios/loading_failed',

//   ADD_PRECIOS = 'precios/add',
//   ADDING_PRECIOS = 'precios/adding',
//   ADDED_PRECIOS = 'precios/added',
//   ADDING_PRECIOS_FAILED = 'precios/adding_failed',

//   REMOVE_PRECIO = 'precios/remove',
//   REMOVING_PRECIO = 'precios/removing',
//   REMOVED_PRECIO = 'precios/removed',
//   REMOVING_PRECIO_FAILED = 'precios/removing_failed',

//   EDIT_PRECIOS = 'precios/edit',
//   EDITING_PRECIOS = 'precios/editing',
//   EDITED_PRECIOS = 'precios/edited',
//   EDITING_PRECIOS_FAILED = 'precios/editing_failed',
// }

// export function searchPrecios(searchOptions: TSearchOptions | string, keep?: boolean): ISearchPreciosAction {
//   return {
//     type: PreciosActionTypes.SEARCH_PRECIOS,
//     searchOptions: typeof searchOptions === 'string' ? { searchString: searchOptions } : searchOptions,
//     keep: keep,
//   }
// }

// export function searchingPrecios(): ISearchingPreciosAction {
//   return {
//     type: PreciosActionTypes.SEARCHING_PRECIOS,
//   }
// }

// export function foundPrecios(precios: IpaginatedPrecios, keep?: boolean): IFoundPreciosAction {
//   return {
//     type: PreciosActionTypes.FOUND_PRECIOS,
//     keep: keep,
//     payload: {
//       precios,
//     },
//   }
// }

// export function searchingPreciosFailed(): ISearchingPreciosFailedAction {
//   return {
//     type: PreciosActionTypes.SEARCHING_PRECIOS_FAILED,
//   }
// }

// export function loadPrecios(loadOptions: TSearchOptions): ILoadPreciosAction {
//   return {
//     type: PreciosActionTypes.LOAD_PRECIOS,
//     loadOptions: loadOptions,
//   }
// }

// export function loadingPrecios(): ILoadingPreciosAction {
//   return {
//     type: PreciosActionTypes.LOADING_PRECIOS,
//   }
// }

// export function loadedPrecios(precios: IpaginatedPrecios): ILoadedPreciosAction {
//   return {
//     type: PreciosActionTypes.LOADED_PRECIOS,
//     payload: {
//       precios,
//     },
//   }
// }

// export function loadingPreciosFailed(): ILoadingPreciosFailedAction {
//   return {
//     type: PreciosActionTypes.LOADING_PRECIOS_FAILED,
//   }
// }

// export function addPrecios(precio: IPreciosItem): IAddPreciosAction {
//   return {
//     type: PreciosActionTypes.ADD_PRECIOS,
//     payload: precio,
//   }
// }

// export function addingPrecios(): IAddingPreciosAction {
//   return {
//     type: PreciosActionTypes.ADDING_PRECIOS,
//   }
// }

// export function addedPrecios(precios: IpaginatedPrecios): IAddedPreciosAction {
//   return {
//     type: PreciosActionTypes.ADDED_PRECIOS,
//     payload: {
//       precios,
//     },
//   }
// }

// export function addingPreciosFailed(errData: { data: { message: string; field?: string }; status: number }): IAddingPreciosFailedAction {
//   return {
//     type: PreciosActionTypes.ADDING_PRECIOS_FAILED,
//     message: errData.data.message,
//     status: errData.status,
//     field: errData.data.field,
//   }
// }

// export function removePrecio(precio: IPreciosItem): IRemovePrecioAction {
//   return {
//     type: PreciosActionTypes.REMOVE_PRECIO,
//     payload: precio,
//   }
// }

// export function removingPrecio(): IRemovingPrecioAction {
//   return {
//     type: PreciosActionTypes.REMOVING_PRECIO,
//   }
// }

// export function removedPrecio(): IRemovedPrecioAction {
//   return {
//     type: PreciosActionTypes.REMOVED_PRECIO,
//   }
// }

// export function removingPrecioFailed(): IRemovingPrecioFailedAction {
//   return {
//     type: PreciosActionTypes.REMOVING_PRECIO_FAILED,
//   }
// }

// export function editPrecios(precio: IPreciosItem): IEditPreciosAction {
//   return {
//     type: PreciosActionTypes.EDIT_PRECIOS,
//     payload: precio,
//   }
// }

// export function editingPrecios(): IEditingPreciosAction {
//   return {
//     type: PreciosActionTypes.EDITING_PRECIOS,
//   }
// }

// export function editedPrecios(precios: IPreciosItem): IEditedPreciosAction {
//   return {
//     type: PreciosActionTypes.EDITED_PRECIOS,
//     payload: precios,
//   }
// }

// export function editingPreciosFailed(): IEditingPreciosFailedAction {
//   return {
//     type: PreciosActionTypes.EDITING_PRECIOS_FAILED,
//   }
// }

// type TSearchOptions = {
//   searchString?: string
//   searchField?: string
//   page?: number
//   limit?: number
//   populate?: boolean
//   sort?: {
//     field: string
//     method?: 'asc' | 'desc'
//   }
//   filters?: { field: string; value: string }[]
// }

// export interface ISearchPreciosAction {
//   type: PreciosActionTypes.SEARCH_PRECIOS
//   searchOptions: TSearchOptions
//   keep?: boolean
// }

// export interface ISearchingPreciosAction {
//   type: PreciosActionTypes.SEARCHING_PRECIOS
// }

// export interface IFoundPreciosAction {
//   type: PreciosActionTypes.FOUND_PRECIOS
//   keep?: boolean
//   payload: {
//     precios: IpaginatedPrecios
//   }
// }

// export interface ISearchingPreciosFailedAction {
//   type: PreciosActionTypes.SEARCHING_PRECIOS_FAILED
// }

// export interface ILoadPreciosAction {
//   type: PreciosActionTypes.LOAD_PRECIOS
//   loadOptions: TSearchOptions
// }

// export interface ILoadingPreciosAction {
//   type: PreciosActionTypes.LOADING_PRECIOS
// }

// export interface ILoadedPreciosAction {
//   type: PreciosActionTypes.LOADED_PRECIOS
//   payload: {
//     precios: IpaginatedPrecios
//   }
// }

// export interface ILoadingPreciosFailedAction {
//   type: PreciosActionTypes.LOADING_PRECIOS_FAILED
// }

// export interface IAddPreciosAction {
//   type: PreciosActionTypes.ADD_PRECIOS
//   payload: IPreciosItem
// }

// export interface IAddingPreciosAction {
//   type: PreciosActionTypes.ADDING_PRECIOS
// }

// export interface IAddedPreciosAction {
//   type: PreciosActionTypes.ADDED_PRECIOS
//   payload: {
//     precios: IpaginatedPrecios
//   }
// }

// export interface IAddingPreciosFailedAction {
//   type: PreciosActionTypes.ADDING_PRECIOS_FAILED
//   message: string
//   status: number
//   field?: string
// }

// export interface IRemovePrecioAction {
//   type: PreciosActionTypes.REMOVE_PRECIO
//   payload: IPreciosItem
// }

// export interface IRemovingPrecioAction {
//   type: PreciosActionTypes.REMOVING_PRECIO
// }

// export interface IRemovedPrecioAction {
//   type: PreciosActionTypes.REMOVED_PRECIO
// }

// export interface IRemovingPrecioFailedAction {
//   type: PreciosActionTypes.REMOVING_PRECIO_FAILED
// }

// export interface IEditPreciosAction {
//   type: PreciosActionTypes.EDIT_PRECIOS
//   payload: IPreciosItem
// }

// export interface IEditingPreciosAction {
//   type: PreciosActionTypes.EDITING_PRECIOS
// }

// export interface IEditedPreciosAction {
//   type: PreciosActionTypes.EDITED_PRECIOS
//   payload: IPreciosItem
// }

// export interface IEditingPreciosFailedAction {
//   type: PreciosActionTypes.EDITING_PRECIOS_FAILED
// }

// export type PreciosAction =
//   | ISearchPreciosAction
//   | ISearchingPreciosAction
//   | IFoundPreciosAction
//   | ISearchingPreciosFailedAction
//   | ILoadPreciosAction
//   | ILoadingPreciosAction
//   | ILoadedPreciosAction
//   | ILoadingPreciosFailedAction
//   | IAddPreciosAction
//   | IAddingPreciosAction
//   | IAddedPreciosAction
//   | IAddingPreciosFailedAction
//   | IRemovePrecioAction
//   | IRemovingPrecioAction
//   | IRemovedPrecioAction
//   | IRemovingPrecioFailedAction
//   | IEditPreciosAction
//   | IEditingPreciosAction
//   | IEditedPreciosAction
//   | IEditingPreciosFailedAction
