import produce from 'immer'
import { TicketsAction, TicketsActionTypes } from '../actions/ticketsActions'
import { ApiStatus, ITicketsItem } from '../models'

export const initialTicketsState: ITicketsState = {
  loadingStatus: ApiStatus.NOTLOADED,
  addingStatus: ApiStatus.NOTLOADED,
  searchingStatus: ApiStatus.NOTLOADED,
  searchString: '',
  tickets: [],
  foundtickets: [],
  totalDocs: 0,
  errMessage: '',
  errStatus: null,
  errField: null,
}

export default function ticketsReducer(state: ITicketsState = initialTicketsState, action: TicketsAction) {
  return produce(state, (draft) => {
    switch (action.type) {
      case TicketsActionTypes.SEARCH_TICKETS:
        draft.searchString = action.searchOptions.searchString
        break
      case TicketsActionTypes.SEARCHING_TICKETS:
        draft.searchingStatus = ApiStatus.LOADING
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.NOTLOADED
        break

      case TicketsActionTypes.SEARCHING_TICKETS_FAILED:
        draft.searchingStatus = ApiStatus.FAILED
        break

      case TicketsActionTypes.FOUND_TICKETS:
        draft.searchingStatus = ApiStatus.LOADED
        action.keep ? draft.foundtickets.push(...action.payload.tickets.docs) : (draft.foundtickets = action.payload.tickets.docs)
        draft.totalDocs = action.payload.tickets.totalDocs
        break

      case TicketsActionTypes.LOAD_TICKETS:
      case TicketsActionTypes.LOADING_TICKETS:
        draft.loadingStatus = ApiStatus.LOADING
        draft.addingStatus = ApiStatus.NOTLOADED
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.foundtickets = []
        break

      case TicketsActionTypes.LOADING_TICKETS_FAILED:
        draft.loadingStatus = ApiStatus.FAILED
        break

      case TicketsActionTypes.LOADED_TICKETS:
        draft.loadingStatus = ApiStatus.LOADED
        draft.tickets = action.payload.tickets.docs
        draft.totalDocs = action.payload.tickets.totalDocs
        break

      case TicketsActionTypes.ADD_TICKETS:
      case TicketsActionTypes.ADDING_TICKETS:
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.errMessage = ''
        draft.errStatus = null
        draft.errField = null
        break

      case TicketsActionTypes.ADDING_TICKETS_FAILED:
        draft.addingStatus = ApiStatus.FAILED
        draft.errMessage = action.message
        draft.errStatus = action.status
        draft.errField = action.field
        break

      case TicketsActionTypes.ADDED_TICKETS:
        draft.addingStatus = ApiStatus.LOADED
        draft.errStatus = 200
        draft.tickets.push(action.payload.tickets.docs[0])
        if (draft.searchString) draft.foundtickets.push(action.payload.tickets.docs[0])
        break

      case TicketsActionTypes.REMOVE_TICKET:
        draft.tickets.splice(
          draft.tickets.findIndex((ticket) => ticket._id === action.payload._id),
          1
        )
        break

      case TicketsActionTypes.EDIT_TICKETS:
        draft.loadingStatus = ApiStatus.NOTLOADED
        draft.addingStatus = ApiStatus.LOADING
        draft.searchingStatus = ApiStatus.NOTLOADED
        draft.tickets[draft.tickets.findIndex((ticket) => ticket._id === action.payload._id)] = action.payload
        break

      case TicketsActionTypes.EDITED_TICKETS:
        draft.addingStatus = ApiStatus.LOADED
        draft.tickets[draft.tickets.findIndex((ticket) => ticket._id === action.payload._id)] = action.payload
        draft.foundtickets[draft.foundtickets.findIndex((ticket) => ticket._id === action.payload._id)] = action.payload
        break
    }
  })
}

export interface ITicketsState {
  loadingStatus: ApiStatus
  addingStatus: ApiStatus
  searchingStatus: ApiStatus
  searchString: string
  tickets: ITicketsItem[]
  foundtickets: ITicketsItem[]
  totalDocs: number
  errMessage?: string
  errStatus?: number
  errField?: string
}
