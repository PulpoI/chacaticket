import produce from 'immer'
import { UbicacionesAction, UbicacionesActionTypes } from '../actions/ubicacionesActions'
import { ApiStatus, IUbicacionesItem } from '../models'

export const initialUbicacionesState: IUbicacionesState = {
  loadingStatus: ApiStatus.NOTLOADED,
  addingStatus: ApiStatus.NOTLOADED,
  searchingStatus: ApiStatus.NOTLOADED,
  searchString: '',
  ubicaciones: [],
  foundubicaciones: [],
  totalDocs: 0,
  errMessage: '',
  errStatus: null,
  errField: null,
}

export default function ubicacionesReducer(state: IUbicacionesState = initialUbicacionesState, action: UbicacionesAction) {
  return produce(state, (draft) => {
    switch (action.type) {
      case UbicacionesActionTypes.SEARCH_UBICACIONES:
        draft.searchString = action.searchOptions.searchString
        break
      case UbicacionesActionTypes.SEARCHING_UBICACIONES:
        draft.searchingStatus = ApiStatus.LOADING
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.NOTLOADED
        break

      case UbicacionesActionTypes.SEARCHING_UBICACIONES_FAILED:
        draft.searchingStatus = ApiStatus.FAILED
        break

      case UbicacionesActionTypes.FOUND_UBICACIONES:
        draft.searchingStatus = ApiStatus.LOADED
        action.keep ? draft.foundubicaciones.push(...action.payload.ubicaciones.docs) : (draft.foundubicaciones = action.payload.ubicaciones.docs)
        draft.totalDocs = action.payload.ubicaciones.totalDocs
        break

      case UbicacionesActionTypes.LOAD_UBICACIONES:
      case UbicacionesActionTypes.LOADING_UBICACIONES:
        draft.loadingStatus = ApiStatus.LOADING
        draft.addingStatus = ApiStatus.NOTLOADED
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.foundubicaciones = []
        break

      case UbicacionesActionTypes.LOADING_UBICACIONES_FAILED:
        draft.loadingStatus = ApiStatus.FAILED
        break

      case UbicacionesActionTypes.LOADED_UBICACIONES:
        draft.loadingStatus = ApiStatus.LOADED
        draft.ubicaciones = action.payload.ubicaciones.docs
        draft.totalDocs = action.payload.ubicaciones.totalDocs
        break

      case UbicacionesActionTypes.ADD_UBICACIONES:
      case UbicacionesActionTypes.ADDING_UBICACIONES:
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.errMessage = ''
        draft.errStatus = null
        draft.errField = null
        break

      case UbicacionesActionTypes.ADDING_UBICACIONES_FAILED:
        draft.addingStatus = ApiStatus.FAILED
        draft.errMessage = action.message
        draft.errStatus = action.status
        draft.errField = action.field
        break

      case UbicacionesActionTypes.ADDED_UBICACIONES:
        draft.addingStatus = ApiStatus.LOADED
        draft.errStatus = 200
        draft.ubicaciones.push(action.payload.ubicaciones.docs[0])
        if (draft.searchString) draft.foundubicaciones.push(action.payload.ubicaciones.docs[0])
        break

      case UbicacionesActionTypes.REMOVE_UBICACION:
        draft.ubicaciones.splice(
          draft.ubicaciones.findIndex((ubicacion) => ubicacion._id === action.payload._id),
          1
        )
        break

      case UbicacionesActionTypes.EDIT_UBICACIONES:
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.ubicaciones[draft.ubicaciones.findIndex((ubicacion) => ubicacion._id === action.payload._id)] = action.payload
        break

      case UbicacionesActionTypes.EDITED_UBICACIONES:
        draft.addingStatus = ApiStatus.LOADED
        draft.ubicaciones[draft.ubicaciones.findIndex((ubicacion) => ubicacion._id === action.payload._id)] = action.payload
        draft.foundubicaciones[draft.foundubicaciones.findIndex((ubicacion) => ubicacion._id === action.payload._id)] = action.payload
        break
    }
  })
}

export interface IUbicacionesState {
  loadingStatus: ApiStatus
  addingStatus: ApiStatus
  searchingStatus: ApiStatus
  searchString: string
  ubicaciones: IUbicacionesItem[]
  foundubicaciones: IUbicacionesItem[]
  totalDocs: number
  errMessage?: string
  errStatus?: number
  errField?: string
}
