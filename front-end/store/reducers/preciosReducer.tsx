import produce from 'immer'
import { PreciosAction, PreciosActionTypes } from '../actions/preciosActions'
import { ApiStatus, IPreciosItem } from '../models'

export const initialPreciosState: IPreciosState = {
  loadingStatus: ApiStatus.NOTLOADED,
  addingStatus: ApiStatus.NOTLOADED,
  searchingStatus: ApiStatus.NOTLOADED,
  searchString: '',
  precios: [],
  foundprecios: [],
  totalDocs: 0,
  errMessage: '',
  errStatus: null,
  errField: null,
}

export default function preciosReducer(state: IPreciosState = initialPreciosState, action: PreciosAction) {
  return produce(state, (draft) => {
    switch (action.type) {
      case PreciosActionTypes.SEARCH_PRECIOS:
        draft.searchString = action.searchOptions.searchString
        break
      case PreciosActionTypes.SEARCHING_PRECIOS:
        draft.searchingStatus = ApiStatus.LOADING
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.NOTLOADED
        break

      case PreciosActionTypes.SEARCHING_PRECIOS_FAILED:
        draft.searchingStatus = ApiStatus.FAILED
        break

      case PreciosActionTypes.FOUND_PRECIOS:
        draft.searchingStatus = ApiStatus.LOADED
        action.keep ? draft.foundprecios.push(...action.payload.precios.docs) : (draft.foundprecios = action.payload.precios.docs)
        draft.totalDocs = action.payload.precios.totalDocs
        break

      case PreciosActionTypes.LOAD_PRECIOS:
      case PreciosActionTypes.LOADING_PRECIOS:
        draft.loadingStatus = ApiStatus.LOADING
        draft.addingStatus = ApiStatus.NOTLOADED
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.foundprecios = []
        break

      case PreciosActionTypes.LOADING_PRECIOS_FAILED:
        draft.loadingStatus = ApiStatus.FAILED
        break

      case PreciosActionTypes.LOADED_PRECIOS:
        draft.loadingStatus = ApiStatus.LOADED
        draft.precios = action.payload.precios.docs
        draft.totalDocs = action.payload.precios.totalDocs
        break

      case PreciosActionTypes.ADD_PRECIOS:
      case PreciosActionTypes.ADDING_PRECIOS:
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.errMessage = ''
        draft.errStatus = null
        draft.errField = null
        break

      case PreciosActionTypes.ADDING_PRECIOS_FAILED:
        draft.addingStatus = ApiStatus.FAILED
        draft.errMessage = action.message
        draft.errStatus = action.status
        draft.errField = action.field
        break

      case PreciosActionTypes.ADDED_PRECIOS:
        draft.addingStatus = ApiStatus.LOADED
        draft.errStatus = 200
        draft.precios.push(action.payload.precios.docs[0])
        if (draft.searchString) draft.foundprecios.push(action.payload.precios.docs[0])
        break

      case PreciosActionTypes.REMOVE_PRECIO:
        draft.precios.splice(
          draft.precios.findIndex((precio) => precio._id === action.payload._id),
          1
        )
        break

      case PreciosActionTypes.EDIT_PRECIOS:
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.precios[draft.precios.findIndex((precio) => precio._id === action.payload._id)] = action.payload
        break

      case PreciosActionTypes.EDITED_PRECIOS:
        draft.addingStatus = ApiStatus.LOADED
        draft.precios[draft.precios.findIndex((precio) => precio._id === action.payload._id)] = action.payload
        draft.foundprecios[draft.foundprecios.findIndex((precio) => precio._id === action.payload._id)] = action.payload
        break
    }
  })
}

export interface IPreciosState {
  loadingStatus: ApiStatus
  addingStatus: ApiStatus
  searchingStatus: ApiStatus
  searchString: string
  precios: IPreciosItem[]
  foundprecios: IPreciosItem[]
  totalDocs: number
  errMessage?: string
  errStatus?: number
  errField?: string
}
