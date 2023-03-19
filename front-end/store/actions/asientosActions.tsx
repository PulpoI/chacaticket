// import { IAsientosItem, IpaginatedAsientos } from '../models'

// export enum AsientosActionTypes {
//   SEARCH_ASIENTOS = 'asientos/search',
//   SEARCHING_ASIENTOS = 'asientos/searching',
//   FOUND_ASIENTOS = 'asientos/found',
//   SEARCHING_ASIENTOS_FAILED = 'asientos/searching_failed',

//   LOAD_ASIENTOS = 'asientos/load',
//   LOADING_ASIENTOS = 'asientos/loading',
//   LOADED_ASIENTOS = 'asientos/loaded',
//   LOADING_ASIENTOS_FAILED = 'asientos/loading_failed',

//   ADD_ASIENTOS = 'asientos/add',
//   ADDING_ASIENTOS = 'asientos/adding',
//   ADDED_ASIENTOS = 'asientos/added',
//   ADDING_ASIENTOS_FAILED = 'asientos/adding_failed',

//   REMOVE_ASIENTO = 'asientos/remove',
//   REMOVING_ASIENTO = 'asientos/removing',
//   REMOVED_ASIENTO = 'asientos/removed',
//   REMOVING_ASIENTO_FAILED = 'asientos/removing_failed',

//   EDIT_ASIENTOS = 'asientos/edit',
//   EDITING_ASIENTOS = 'asientos/editing',
//   EDITED_ASIENTOS = 'asientos/edited',
//   EDITING_ASIENTOS_FAILED = 'asientos/editing_failed',
// }

// export function searchAsientos(searchOptions: TSearchOptions | string, keep?: boolean): ISearchAsientosAction {
//   return {
//     type: AsientosActionTypes.SEARCH_ASIENTOS,
//     searchOptions: typeof searchOptions === 'string' ? { searchString: searchOptions } : searchOptions,
//     keep: keep,
//   }
// }

// export function searchingAsientos(): ISearchingAsientosAction {
//   return {
//     type: AsientosActionTypes.SEARCHING_ASIENTOS,
//   }
// }

// export function foundAsientos(asientos: IpaginatedAsientos, keep?: boolean): IFoundAsientosAction {
//   return {
//     type: AsientosActionTypes.FOUND_ASIENTOS,
//     keep: keep,
//     payload: {
//       asientos,
//     },
//   }
// }

// export function searchingAsientosFailed(): ISearchingAsientosFailedAction {
//   return {
//     type: AsientosActionTypes.SEARCHING_ASIENTOS_FAILED,
//   }
// }

// export function loadAsientos(loadOptions: TSearchOptions): ILoadAsientosAction {
//   return {
//     type: AsientosActionTypes.LOAD_ASIENTOS,
//     loadOptions: loadOptions,
//   }
// }

// export function loadingAsientos(): ILoadingAsientosAction {
//   return {
//     type: AsientosActionTypes.LOADING_ASIENTOS,
//   }
// }

// export function loadedAsientos(asientos: IpaginatedAsientos): ILoadedAsientosAction {
//   return {
//     type: AsientosActionTypes.LOADED_ASIENTOS,
//     payload: {
//       asientos,
//     },
//   }
// }

// export function loadingAsientosFailed(): ILoadingAsientosFailedAction {
//   return {
//     type: AsientosActionTypes.LOADING_ASIENTOS_FAILED,
//   }
// }

// export function addAsientos(asiento: IAsientosItem): IAddAsientosAction {
//   return {
//     type: AsientosActionTypes.ADD_ASIENTOS,
//     payload: asiento,
//   }
// }

// export function addingAsientos(): IAddingAsientosAction {
//   return {
//     type: AsientosActionTypes.ADDING_ASIENTOS,
//   }
// }

// export function addedAsientos(asientos: IpaginatedAsientos): IAddedAsientosAction {
//   return {
//     type: AsientosActionTypes.ADDED_ASIENTOS,
//     payload: {
//       asientos,
//     },
//   }
// }

// export function addingAsientosFailed(errData: { data: { message: string; field?: string }; status: number }): IAddingAsientosFailedAction {
//   return {
//     type: AsientosActionTypes.ADDING_ASIENTOS_FAILED,
//     message: errData.data.message,
//     status: errData.status,
//     field: errData.data.field,
//   }
// }

// export function removeAsiento(asiento: IAsientosItem): IRemoveAsientoAction {
//   return {
//     type: AsientosActionTypes.REMOVE_ASIENTO,
//     payload: asiento,
//   }
// }

// export function removingAsiento(): IRemovingAsientoAction {
//   return {
//     type: AsientosActionTypes.REMOVING_ASIENTO,
//   }
// }

// export function removedAsiento(): IRemovedAsientoAction {
//   return {
//     type: AsientosActionTypes.REMOVED_ASIENTO,
//   }
// }

// export function removingAsientoFailed(): IRemovingAsientoFailedAction {
//   return {
//     type: AsientosActionTypes.REMOVING_ASIENTO_FAILED,
//   }
// }

// export function editAsientos(asiento: IAsientosItem): IEditAsientosAction {
//   return {
//     type: AsientosActionTypes.EDIT_ASIENTOS,
//     payload: asiento,
//   }
// }

// export function editingAsientos(): IEditingAsientosAction {
//   return {
//     type: AsientosActionTypes.EDITING_ASIENTOS,
//   }
// }

// export function editedAsientos(asientos: IAsientosItem): IEditedAsientosAction {
//   return {
//     type: AsientosActionTypes.EDITED_ASIENTOS,
//     payload: asientos,
//   }
// }

// export function editingAsientosFailed(): IEditingAsientosFailedAction {
//   return {
//     type: AsientosActionTypes.EDITING_ASIENTOS_FAILED,
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

// export interface ISearchAsientosAction {
//   type: AsientosActionTypes.SEARCH_ASIENTOS
//   searchOptions: TSearchOptions
//   keep?: boolean
// }

// export interface ISearchingAsientosAction {
//   type: AsientosActionTypes.SEARCHING_ASIENTOS
// }

// export interface IFoundAsientosAction {
//   type: AsientosActionTypes.FOUND_ASIENTOS
//   keep?: boolean
//   payload: {
//     asientos: IpaginatedAsientos
//   }
// }

// export interface ISearchingAsientosFailedAction {
//   type: AsientosActionTypes.SEARCHING_ASIENTOS_FAILED
// }

// export interface ILoadAsientosAction {
//   type: AsientosActionTypes.LOAD_ASIENTOS
//   loadOptions: TSearchOptions
// }

// export interface ILoadingAsientosAction {
//   type: AsientosActionTypes.LOADING_ASIENTOS
// }

// export interface ILoadedAsientosAction {
//   type: AsientosActionTypes.LOADED_ASIENTOS
//   payload: {
//     asientos: IpaginatedAsientos
//   }
// }

// export interface ILoadingAsientosFailedAction {
//   type: AsientosActionTypes.LOADING_ASIENTOS_FAILED
// }

// export interface IAddAsientosAction {
//   type: AsientosActionTypes.ADD_ASIENTOS
//   payload: IAsientosItem
// }

// export interface IAddingAsientosAction {
//   type: AsientosActionTypes.ADDING_ASIENTOS
// }

// export interface IAddedAsientosAction {
//   type: AsientosActionTypes.ADDED_ASIENTOS
//   payload: {
//     asientos: IpaginatedAsientos
//   }
// }

// export interface IAddingAsientosFailedAction {
//   type: AsientosActionTypes.ADDING_ASIENTOS_FAILED
//   message: string
//   status: number
//   field?: string
// }

// export interface IRemoveAsientoAction {
//   type: AsientosActionTypes.REMOVE_ASIENTO
//   payload: IAsientosItem
// }

// export interface IRemovingAsientoAction {
//   type: AsientosActionTypes.REMOVING_ASIENTO
// }

// export interface IRemovedAsientoAction {
//   type: AsientosActionTypes.REMOVED_ASIENTO
// }

// export interface IRemovingAsientoFailedAction {
//   type: AsientosActionTypes.REMOVING_ASIENTO_FAILED
// }

// export interface IEditAsientosAction {
//   type: AsientosActionTypes.EDIT_ASIENTOS
//   payload: IAsientosItem
// }

// export interface IEditingAsientosAction {
//   type: AsientosActionTypes.EDITING_ASIENTOS
// }

// export interface IEditedAsientosAction {
//   type: AsientosActionTypes.EDITED_ASIENTOS
//   payload: IAsientosItem
// }

// export interface IEditingAsientosFailedAction {
//   type: AsientosActionTypes.EDITING_ASIENTOS_FAILED
// }

// export type AsientosAction =
//   | ISearchAsientosAction
//   | ISearchingAsientosAction
//   | IFoundAsientosAction
//   | ISearchingAsientosFailedAction
//   | ILoadAsientosAction
//   | ILoadingAsientosAction
//   | ILoadedAsientosAction
//   | ILoadingAsientosFailedAction
//   | IAddAsientosAction
//   | IAddingAsientosAction
//   | IAddedAsientosAction
//   | IAddingAsientosFailedAction
//   | IRemoveAsientoAction
//   | IRemovingAsientoAction
//   | IRemovedAsientoAction
//   | IRemovingAsientoFailedAction
//   | IEditAsientosAction
//   | IEditingAsientosAction
//   | IEditedAsientosAction
//   | IEditingAsientosFailedAction
