import produce from 'immer'
import { ZonasAction, ZonasActionTypes } from '../actions/zonasActions'
import { ApiStatus, IZonasItem } from '../models'

export const initialZonasState: IZonasState = {
  loadingStatus: ApiStatus.NOTLOADED,
  addingStatus: ApiStatus.NOTLOADED,
  searchingStatus: ApiStatus.NOTLOADED,
  searchString: '',
  zonas: [],
  foundzonas: [],
  totalDocs: 0,
  errMessage: '',
  errStatus: null,
  errField: null,
}

export default function zonasReducer(state: IZonasState = initialZonasState, action: ZonasAction) {
  return produce(state, (draft) => {
    switch (action.type) {
      case ZonasActionTypes.SEARCH_ZONAS:
        draft.searchString = action.searchOptions.searchString
        break
      case ZonasActionTypes.SEARCHING_ZONAS:
        draft.searchingStatus = ApiStatus.LOADING
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.NOTLOADED
        break

      case ZonasActionTypes.SEARCHING_ZONAS_FAILED:
        draft.searchingStatus = ApiStatus.FAILED
        break

      case ZonasActionTypes.FOUND_ZONAS:
        draft.searchingStatus = ApiStatus.LOADED
        action.keep ? draft.foundzonas.push(...action.payload.zonas.docs) : (draft.foundzonas = action.payload.zonas.docs)
        draft.totalDocs = action.payload.zonas.totalDocs
        break

      case ZonasActionTypes.LOAD_ZONAS:
      case ZonasActionTypes.LOADING_ZONAS:
        draft.loadingStatus = ApiStatus.LOADING
        draft.addingStatus = ApiStatus.NOTLOADED
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.foundzonas = []
        break

      case ZonasActionTypes.LOADING_ZONAS_FAILED:
        draft.loadingStatus = ApiStatus.FAILED
        break

      case ZonasActionTypes.LOADED_ZONAS:
        draft.loadingStatus = ApiStatus.LOADED
        draft.zonas = action.payload.zonas.docs
        draft.totalDocs = action.payload.zonas.totalDocs
        break

      case ZonasActionTypes.ADD_ZONAS:
      case ZonasActionTypes.ADDING_ZONAS:
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.errMessage = ''
        draft.errStatus = null
        draft.errField = null
        break

      case ZonasActionTypes.ADDING_ZONAS_FAILED:
        draft.addingStatus = ApiStatus.FAILED
        draft.errMessage = action.message
        draft.errStatus = action.status
        draft.errField = action.field
        break

      case ZonasActionTypes.ADDED_ZONAS:
        draft.addingStatus = ApiStatus.LOADED
        draft.errStatus = 200
        draft.zonas.push(action.payload.zonas.docs[0])
        if (draft.searchString) draft.foundzonas.push(action.payload.zonas.docs[0])
        break

      case ZonasActionTypes.REMOVE_ZONA:
        draft.zonas.splice(
          draft.zonas.findIndex((zona) => zona._id === action.payload._id),
          1
        )
        break

      case ZonasActionTypes.EDIT_ZONAS:
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.zonas[draft.zonas.findIndex((zona) => zona._id === action.payload._id)] = action.payload
        break

      case ZonasActionTypes.EDITED_ZONAS:
        draft.addingStatus = ApiStatus.LOADED
        draft.zonas[draft.zonas.findIndex((zona) => zona._id === action.payload._id)] = action.payload
        draft.foundzonas[draft.foundzonas.findIndex((zona) => zona._id === action.payload._id)] = action.payload
        break
    }
  })
}

export interface IZonasState {
  loadingStatus: ApiStatus
  addingStatus: ApiStatus
  searchingStatus: ApiStatus
  searchString: string
  zonas: IZonasItem[]
  foundzonas: IZonasItem[]
  totalDocs: number
  errMessage?: string
  errStatus?: number
  errField?: string
}
