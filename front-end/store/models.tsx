export interface IZonasItem {
  _id?: String
  createdAt: Date

  Nombre: string
  Precio: Number
  NombreEvento: IEventosItem
  // Zonas - Tickets - NombreZona - Zonas - Nombre
  Tickets: ITicketsItem[]
}

export interface IpaginatedZonas {
  docs: IZonasItem[]
  totalDocs: number
  offset: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
export interface IEventosItem {
  _id?: String
  createdAt: Date

  Nombre: string
  Fecha: Date

  Hora: string

  Imagen: string
  NombreLugar: IUsersItem
  // Eventos - Zonas - NombreEvento - Eventos - Nombre
  Zonas: IZonasItem[]
}

export interface IpaginatedEventos {
  docs: IEventosItem[]
  totalDocs: number
  offset: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
export interface ITicketsItem {
  _id?: String
  createdAt: Date

  NombreUbicacion: string
  NombreZona: IZonasItem

  NombrePersona: string

  EmailPersona: string
  FechaPago: Date
}

export interface IpaginatedTickets {
  docs: ITicketsItem[]
  totalDocs: number
  offset: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
export interface IUsersItem {
  _id?: String
  createdAt: Date

  FirstName: string

  LastName: string

  Email: string

  Password: string

  ProfilePic: string
  Role: String

  Lugar: string
  // Users - Eventos - NombreLugar - Users - Lugar
  Eventos: IEventosItem[]
}

export interface IpaginatedUsers {
  docs: IUsersItem[]
  totalDocs: number
  offset: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export enum ApiStatus {
  NOTLOADED = 'notloaded',
  LOADING = 'loading',
  LOADED = 'loaded',
  FAILED = 'failed',
}
