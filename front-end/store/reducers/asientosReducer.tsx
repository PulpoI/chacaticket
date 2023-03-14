import produce from 'immer'
import { AsientosAction, AsientosActionTypes } from '../actions/asientosActions'
import { ApiStatus, IAsientosItem } from '../models'

export const initialAsientosState: IAsientosState = {
  loadingStatus: ApiStatus.NOTLOADED,
  addingStatus: ApiStatus.NOTLOADED,
  searchingStatus: ApiStatus.NOTLOADED,
  searchString: '',
  asientos: [],
  foundasientos: [],
  totalDocs: 0,
  errMessage: '',
  errStatus: null,
  errField: null,
}

export default function asientosReducer(state: IAsientosState = initialAsientosState, action: AsientosAction) {
  return produce(state, (draft) => {
    switch (action.type) {
      case AsientosActionTypes.SEARCH_ASIENTOS:
        draft.searchString = action.searchOptions.searchString
        break
      case AsientosActionTypes.SEARCHING_ASIENTOS:
        draft.searchingStatus = ApiStatus.LOADING
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.NOTLOADED
        break

      case AsientosActionTypes.SEARCHING_ASIENTOS_FAILED:
        draft.searchingStatus = ApiStatus.FAILED
        break

      case AsientosActionTypes.FOUND_ASIENTOS:
        draft.searchingStatus = ApiStatus.LOADED
        action.keep ? draft.foundasientos.push(...action.payload.asientos.docs) : (draft.foundasientos = action.payload.asientos.docs)
        draft.totalDocs = action.payload.asientos.totalDocs
        break

      case AsientosActionTypes.LOAD_ASIENTOS:
      case AsientosActionTypes.LOADING_ASIENTOS:
        draft.loadingStatus = ApiStatus.LOADING
        draft.addingStatus = ApiStatus.NOTLOADED
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.foundasientos = []
        break

      case AsientosActionTypes.LOADING_ASIENTOS_FAILED:
        draft.loadingStatus = ApiStatus.FAILED
        break

      case AsientosActionTypes.LOADED_ASIENTOS:
        draft.loadingStatus = ApiStatus.LOADED
        draft.asientos = action.payload.asientos.docs
        draft.totalDocs = action.payload.asientos.totalDocs
        break

      case AsientosActionTypes.ADD_ASIENTOS:
      case AsientosActionTypes.ADDING_ASIENTOS:
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.errMessage = ''
        draft.errStatus = null
        draft.errField = null
        break

      case AsientosActionTypes.ADDING_ASIENTOS_FAILED:
        draft.addingStatus = ApiStatus.FAILED
        draft.errMessage = action.message
        draft.errStatus = action.status
        draft.errField = action.field
        break

      case AsientosActionTypes.ADDED_ASIENTOS:
        draft.addingStatus = ApiStatus.LOADED
        draft.errStatus = 200
        draft.asientos.push(action.payload.asientos.docs[0])
        if (draft.searchString) draft.foundasientos.push(action.payload.asientos.docs[0])
        break

      case AsientosActionTypes.REMOVE_ASIENTO:
        draft.asientos.splice(
          draft.asientos.findIndex((asiento) => asiento._id === action.payload._id),
          1
        )
        break

      case AsientosActionTypes.EDIT_ASIENTOS:
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.asientos[draft.asientos.findIndex((asiento) => asiento._id === action.payload._id)] = action.payload
        break

      case AsientosActionTypes.EDITED_ASIENTOS:
        draft.addingStatus = ApiStatus.LOADED
        draft.asientos[draft.asientos.findIndex((asiento) => asiento._id === action.payload._id)] = action.payload
        draft.foundasientos[draft.foundasientos.findIndex((asiento) => asiento._id === action.payload._id)] = action.payload
        break
    }
  })
}

export interface IAsientosState {
  loadingStatus: ApiStatus
  addingStatus: ApiStatus
  searchingStatus: ApiStatus
  searchString: string
  asientos: IAsientosItem[]
  foundasientos: IAsientosItem[]
  totalDocs: number
  errMessage?: string
  errStatus?: number
  errField?: string
}
