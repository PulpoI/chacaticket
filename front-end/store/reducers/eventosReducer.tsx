import produce from 'immer'
import { EventosAction, EventosActionTypes } from '../actions/eventosActions'
import { ApiStatus, IEventosItem } from '../models'

export const initialEventosState: IEventosState = {
  loadingStatus: ApiStatus.NOTLOADED,
  addingStatus: ApiStatus.NOTLOADED,
  searchingStatus: ApiStatus.NOTLOADED,
  searchString: '',
  eventos: [],
  foundeventos: [],
  totalDocs: 0,
  errMessage: '',
  errStatus: null,
  errField: null,
}

export default function eventosReducer(state: IEventosState = initialEventosState, action: EventosAction) {
  return produce(state, (draft) => {
    switch (action.type) {
      case EventosActionTypes.SEARCH_EVENTOS:
        draft.searchString = action.searchOptions.searchString
        break
      case EventosActionTypes.SEARCHING_EVENTOS:
        draft.searchingStatus = ApiStatus.LOADING
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.NOTLOADED
        break

      case EventosActionTypes.SEARCHING_EVENTOS_FAILED:
        draft.searchingStatus = ApiStatus.FAILED
        break

      case EventosActionTypes.FOUND_EVENTOS:
        draft.searchingStatus = ApiStatus.LOADED
        action.keep ? draft.foundeventos.push(...action.payload.eventos.docs) : (draft.foundeventos = action.payload.eventos.docs)
        draft.totalDocs = action.payload.eventos.totalDocs
        break

      case EventosActionTypes.LOAD_EVENTOS:
      case EventosActionTypes.LOADING_EVENTOS:
        draft.loadingStatus = ApiStatus.LOADING
        draft.addingStatus = ApiStatus.NOTLOADED
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.foundeventos = []
        break

      case EventosActionTypes.LOADING_EVENTOS_FAILED:
        draft.loadingStatus = ApiStatus.FAILED
        break

      case EventosActionTypes.LOADED_EVENTOS:
        draft.loadingStatus = ApiStatus.LOADED
        draft.eventos = action.payload.eventos.docs
        draft.totalDocs = action.payload.eventos.totalDocs
        break

      case EventosActionTypes.ADD_EVENTOS:
      case EventosActionTypes.ADDING_EVENTOS:
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.errMessage = ''
        draft.errStatus = null
        draft.errField = null
        break

      case EventosActionTypes.ADDING_EVENTOS_FAILED:
        draft.addingStatus = ApiStatus.FAILED
        draft.errMessage = action.message
        draft.errStatus = action.status
        draft.errField = action.field
        break

      case EventosActionTypes.ADDED_EVENTOS:
        draft.addingStatus = ApiStatus.LOADED
        draft.errStatus = 200
        draft.eventos.push(action.payload.eventos.docs[0])
        if (draft.searchString) draft.foundeventos.push(action.payload.eventos.docs[0])
        break

      case EventosActionTypes.REMOVE_EVENTO:
        draft.eventos.splice(
          draft.eventos.findIndex((evento) => evento._id === action.payload._id),
          1
        )
        break

      case EventosActionTypes.EDIT_EVENTOS:
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.eventos[draft.eventos.findIndex((evento) => evento._id === action.payload._id)] = action.payload
        break

      case EventosActionTypes.EDITED_EVENTOS:
        draft.addingStatus = ApiStatus.LOADED
        draft.eventos[draft.eventos.findIndex((evento) => evento._id === action.payload._id)] = action.payload
        draft.foundeventos[draft.foundeventos.findIndex((evento) => evento._id === action.payload._id)] = action.payload
        break
    }
  })
}

export interface IEventosState {
  loadingStatus: ApiStatus
  addingStatus: ApiStatus
  searchingStatus: ApiStatus
  searchString: string
  eventos: IEventosItem[]
  foundeventos: IEventosItem[]
  totalDocs: number
  errMessage?: string
  errStatus?: number
  errField?: string
}
