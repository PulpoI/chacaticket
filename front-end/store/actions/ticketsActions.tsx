import { IpaginatedTickets, ITicketsItem } from '../models'

export enum TicketsActionTypes {
  SEARCH_TICKETS = 'tickets/search',
  SEARCHING_TICKETS = 'tickets/searching',
  FOUND_TICKETS = 'tickets/found',
  SEARCHING_TICKETS_FAILED = 'tickets/searching_failed',

  LOAD_TICKETS = 'tickets/load',
  LOADING_TICKETS = 'tickets/loading',
  LOADED_TICKETS = 'tickets/loaded',
  LOADING_TICKETS_FAILED = 'tickets/loading_failed',

  ADD_TICKETS = 'tickets/add',
  ADDING_TICKETS = 'tickets/adding',
  ADDED_TICKETS = 'tickets/added',
  ADDING_TICKETS_FAILED = 'tickets/adding_failed',

  REMOVE_TICKET = 'tickets/remove',
  REMOVING_TICKET = 'tickets/removing',
  REMOVED_TICKET = 'tickets/removed',
  REMOVING_TICKET_FAILED = 'tickets/removing_failed',

  EDIT_TICKETS = 'tickets/edit',
  EDITING_TICKETS = 'tickets/editing',
  EDITED_TICKETS = 'tickets/edited',
  EDITING_TICKETS_FAILED = 'tickets/editing_failed',
}

export function searchTickets(searchOptions: TSearchOptions | string, keep?: boolean): ISearchTicketsAction {
  return {
    type: TicketsActionTypes.SEARCH_TICKETS,
    searchOptions: typeof searchOptions === 'string' ? { searchString: searchOptions } : searchOptions,
    keep: keep,
  }
}

export function searchingTickets(): ISearchingTicketsAction {
  return {
    type: TicketsActionTypes.SEARCHING_TICKETS,
  }
}

export function foundTickets(tickets: IpaginatedTickets, keep?: boolean): IFoundTicketsAction {
  return {
    type: TicketsActionTypes.FOUND_TICKETS,
    keep: keep,
    payload: {
      tickets,
    },
  }
}

export function searchingTicketsFailed(): ISearchingTicketsFailedAction {
  return {
    type: TicketsActionTypes.SEARCHING_TICKETS_FAILED,
  }
}

export function loadTickets(loadOptions: TSearchOptions): ILoadTicketsAction {
  return {
    type: TicketsActionTypes.LOAD_TICKETS,
    loadOptions: loadOptions,
  }
}

export function loadingTickets(): ILoadingTicketsAction {
  return {
    type: TicketsActionTypes.LOADING_TICKETS,
  }
}

export function loadedTickets(tickets: IpaginatedTickets): ILoadedTicketsAction {
  return {
    type: TicketsActionTypes.LOADED_TICKETS,
    payload: {
      tickets,
    },
  }
}

export function loadingTicketsFailed(): ILoadingTicketsFailedAction {
  return {
    type: TicketsActionTypes.LOADING_TICKETS_FAILED,
  }
}

export function addTickets(ticket: ITicketsItem): IAddTicketsAction {
  return {
    type: TicketsActionTypes.ADD_TICKETS,
    payload: ticket,
  }
}

export function addingTickets(): IAddingTicketsAction {
  return {
    type: TicketsActionTypes.ADDING_TICKETS,
  }
}

export function addedTickets(tickets: IpaginatedTickets): IAddedTicketsAction {
  return {
    type: TicketsActionTypes.ADDED_TICKETS,
    payload: {
      tickets,
    },
  }
}

export function addingTicketsFailed(errData: { data: { message: string; field?: string }; status: number }): IAddingTicketsFailedAction {
  return {
    type: TicketsActionTypes.ADDING_TICKETS_FAILED,
    message: errData.data.message,
    status: errData.status,
    field: errData.data.field,
  }
}

export function removeTicket(ticket: ITicketsItem): IRemoveTicketAction {
  return {
    type: TicketsActionTypes.REMOVE_TICKET,
    payload: ticket,
  }
}

export function removingTicket(): IRemovingTicketAction {
  return {
    type: TicketsActionTypes.REMOVING_TICKET,
  }
}

export function removedTicket(): IRemovedTicketAction {
  return {
    type: TicketsActionTypes.REMOVED_TICKET,
  }
}

export function removingTicketFailed(): IRemovingTicketFailedAction {
  return {
    type: TicketsActionTypes.REMOVING_TICKET_FAILED,
  }
}

export function editTickets(ticket: ITicketsItem): IEditTicketsAction {
  return {
    type: TicketsActionTypes.EDIT_TICKETS,
    payload: ticket,
  }
}

export function editingTickets(): IEditingTicketsAction {
  return {
    type: TicketsActionTypes.EDITING_TICKETS,
  }
}

export function editedTickets(tickets: ITicketsItem): IEditedTicketsAction {
  return {
    type: TicketsActionTypes.EDITED_TICKETS,
    payload: tickets,
  }
}

export function editingTicketsFailed(): IEditingTicketsFailedAction {
  return {
    type: TicketsActionTypes.EDITING_TICKETS_FAILED,
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

export interface ISearchTicketsAction {
  type: TicketsActionTypes.SEARCH_TICKETS
  searchOptions: TSearchOptions
  keep?: boolean
}

export interface ISearchingTicketsAction {
  type: TicketsActionTypes.SEARCHING_TICKETS
}

export interface IFoundTicketsAction {
  type: TicketsActionTypes.FOUND_TICKETS
  keep?: boolean
  payload: {
    tickets: IpaginatedTickets
  }
}

export interface ISearchingTicketsFailedAction {
  type: TicketsActionTypes.SEARCHING_TICKETS_FAILED
}

export interface ILoadTicketsAction {
  type: TicketsActionTypes.LOAD_TICKETS
  loadOptions: TSearchOptions
}

export interface ILoadingTicketsAction {
  type: TicketsActionTypes.LOADING_TICKETS
}

export interface ILoadedTicketsAction {
  type: TicketsActionTypes.LOADED_TICKETS
  payload: {
    tickets: IpaginatedTickets
  }
}

export interface ILoadingTicketsFailedAction {
  type: TicketsActionTypes.LOADING_TICKETS_FAILED
}

export interface IAddTicketsAction {
  type: TicketsActionTypes.ADD_TICKETS
  payload: ITicketsItem
}

export interface IAddingTicketsAction {
  type: TicketsActionTypes.ADDING_TICKETS
}

export interface IAddedTicketsAction {
  type: TicketsActionTypes.ADDED_TICKETS
  payload: {
    tickets: IpaginatedTickets
  }
}

export interface IAddingTicketsFailedAction {
  type: TicketsActionTypes.ADDING_TICKETS_FAILED
  message: string
  status: number
  field?: string
}

export interface IRemoveTicketAction {
  type: TicketsActionTypes.REMOVE_TICKET
  payload: ITicketsItem
}

export interface IRemovingTicketAction {
  type: TicketsActionTypes.REMOVING_TICKET
}

export interface IRemovedTicketAction {
  type: TicketsActionTypes.REMOVED_TICKET
}

export interface IRemovingTicketFailedAction {
  type: TicketsActionTypes.REMOVING_TICKET_FAILED
}

export interface IEditTicketsAction {
  type: TicketsActionTypes.EDIT_TICKETS
  payload: ITicketsItem
}

export interface IEditingTicketsAction {
  type: TicketsActionTypes.EDITING_TICKETS
}

export interface IEditedTicketsAction {
  type: TicketsActionTypes.EDITED_TICKETS
  payload: ITicketsItem
}

export interface IEditingTicketsFailedAction {
  type: TicketsActionTypes.EDITING_TICKETS_FAILED
}

export type TicketsAction =
  | ISearchTicketsAction
  | ISearchingTicketsAction
  | IFoundTicketsAction
  | ISearchingTicketsFailedAction
  | ILoadTicketsAction
  | ILoadingTicketsAction
  | ILoadedTicketsAction
  | ILoadingTicketsFailedAction
  | IAddTicketsAction
  | IAddingTicketsAction
  | IAddedTicketsAction
  | IAddingTicketsFailedAction
  | IRemoveTicketAction
  | IRemovingTicketAction
  | IRemovedTicketAction
  | IRemovingTicketFailedAction
  | IEditTicketsAction
  | IEditingTicketsAction
  | IEditedTicketsAction
  | IEditingTicketsFailedAction
