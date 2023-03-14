const Tickets = require('../models/tickets.model.js')
const fs = require('fs')
const paginate = require('../paginate')
const errors = require('../services/errors.service')

// Create and Save a new Ticket
exports.create = async (options) => {
  const data = options.req ? options.req.body : options.data
  const updatedData = {}

  if (typeof data.FechaPago !== 'undefined') updatedData['FechaPago'] = data.FechaPago

  if (typeof data.NombrePersona !== 'undefined') updatedData['NombrePersona'] = data.NombrePersona

  updatedData['NombreUbicacion'] = {}
  try {
    const Ubicaciones = require('../models/ubicaciones.model.js')
    let ReceivedNombreUbicacion = typeof data.NombreUbicacion === 'string' ? JSON.parse(data.NombreUbicacion) : data.NombreUbicacion
    NombreUbicacioninfo = Array.isArray(ReceivedNombreUbicacion) ? ReceivedNombreUbicacion[0] : ReceivedNombreUbicacion
    if (!NombreUbicacioninfo._id) {
      const NombreUbicacionID = require('mongoose').Types.ObjectId()
      const Ubicacion = new Ubicaciones({ ...NombreUbicacioninfo, _id: NombreUbicacionID })
      Ubicacion.save()
      updatedData['NombreUbicacion'] = NombreUbicacionID
    } else {
      updatedData['NombreUbicacion'] = NombreUbicacioninfo._id
    }
  } catch (e) {
    updatedData['NombreUbicacion'] = data.NombreUbicacion
  }

  // Create a Ticket
  const Ticket = new Tickets(updatedData)

  // Save Ticket in the database
  Ticket.save()
    .then((data) => {
      exports.findOne({ ID: data._id, res: options.res })
    })
    .catch((err) => {
      options.res.status(500).send({
        message: err.message || 'Some error occurred while saving the record.',
      })
    })
}

exports.createAsPromise = (options) => {
  return new Promise(async (resolve, reject) => {
    const data = options.req ? options.req.body : options.data
    const updatedData = {}
    if (data._id) updatedData._id = data._id

    if (typeof data.FechaPago !== 'undefined') updatedData['FechaPago'] = data.FechaPago

    if (typeof data.NombrePersona !== 'undefined') updatedData['NombrePersona'] = data.NombrePersona

    updatedData['NombreUbicacion'] = {}
    try {
      const Ubicaciones = require('../models/ubicaciones.model.js')
      let ReceivedNombreUbicacion = typeof data.NombreUbicacion === 'string' ? JSON.parse(data.NombreUbicacion) : data.NombreUbicacion
      NombreUbicacioninfo = Array.isArray(ReceivedNombreUbicacion) ? ReceivedNombreUbicacion[0] : ReceivedNombreUbicacion
      if (!NombreUbicacioninfo._id) {
        const NombreUbicacionID = require('mongoose').Types.ObjectId()
        const Ubicacion = new Ubicaciones({ ...NombreUbicacioninfo, _id: NombreUbicacionID })
        Ubicacion.save()
        updatedData['NombreUbicacion'] = NombreUbicacionID
      } else {
        updatedData['NombreUbicacion'] = NombreUbicacioninfo._id
      }
    } catch (e) {
      updatedData['NombreUbicacion'] = data.NombreUbicacion
    }

    // Create a Ticket
    const Ticket = new Tickets(updatedData)

    // Save Ticket in the database
    Ticket.save()
      .then((result) => {
        if (options.skipfind) {
          resolve(result)
        } else {
          exports.findOne({ ID: result._id, res: options.res }).then((result) => {
            resolve(result)
          })
        }
      })
      .catch((err) => {
        reject(errors.prepareError(err))
      })
  })
}

// Retrieve and return all Tickets from the database.
exports.findAll = (options) => {
  const query = options.query ? options.query : options.req.query
  if (typeof query.populate === 'undefined') query.populate = 'true'
  const data = options.req ? options.req.body : options.data
  if (typeof query.sort === 'string') query.sort = JSON.parse(query.sort)

  const findString = {}
  if (query.fixedSearch) {
    query.fixedSearch = JSON.parse(query.fixedSearch)
    findString[query.fixedSearch.field] = { $regex: new RegExp(query.fixedSearch.value, 'i') }
  }

  Tickets.find(findString)
    .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

    .populate(
      (query.populate === 'true' || query.populate?.indexOf('Ubicaciones') > -1) && {
        strictPopulate: false,
        model: 'Ubicaciones',
        path: 'NombreUbicacion',
        populate: [{ strictPopulate: false, model: 'Zonas', path: 'NombreZona' }],
      }
    )
    .then((tickets) => {
      options.res.json(paginate.paginate(tickets, { page: query.page, limit: query.limit || 10 }))
    })
    .catch((err) => {
      options.res.status(500).send({
        message: err.message || 'Some error occurred while retrieving records.',
      })
    })
}

exports.find = (options) => {
  return new Promise((resolve, reject) => {
    const query = options.query ? options.query : options.req.query
    const data = options.req ? options.req.body : options.data
    let findString = query.searchString ? { $text: { $search: query.searchString } } : {}
    if (query.searchField) {
      if (Tickets.schema.path(query.searchField).instance === 'Boolean') {
        findString = { [query.searchField]: JSON.parse(query.searchString) }
      } else if (Tickets.schema.path(query.searchField).instance === 'Date') {
        findString = { $expr: { $eq: [query.searchString, { $dateToString: { date: `$${query.searchField}`, format: '%Y-%m-%d' } }] } }
      } else {
        findString = { [query.searchField]: { $regex: new RegExp(query.searchString, 'i') } }
      }

      if (Tickets.schema.path(query.searchField).instance === 'ObjectID' || Tickets.schema.path(query.searchField).instance === 'Array') {
        findString = { [query.searchField]: require('mongoose').Types.ObjectId(query.searchString) }
      }
    } else if (query.filters) {
      query.filters.forEach((filter) => {
        const parsed = typeof filter === 'string' ? JSON.parse(filter) : filter
        findString[parsed.field] = parsed.value
      })
    }
    if (typeof query.sort === 'string') query.sort = JSON.parse(query.sort)

    if (query.fixedSearch) {
      query.fixedSearch = JSON.parse(query.fixedSearch)
      findString[query.fixedSearch.field] = { $regex: new RegExp(query.fixedSearch.value, 'i') }
    }

    Tickets.find(findString)
      .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Ubicaciones') > -1) && {
          strictPopulate: false,
          model: 'Ubicaciones',
          path: 'NombreUbicacion',
          populate: [{ strictPopulate: false, model: 'Zonas', path: 'NombreZona' }],
        }
      )
      .then((ticket) => {
        resolve(paginate.paginate(ticket, { page: query.page, limit: query.limit || 10 }))
      })
      .catch((err) => {
        options.res.status(500).send({
          message: err.message || 'Some error occurred while retrieving records.',
        })
      })
  })
}

// Find a single Ticket with a ID
exports.findOne = (options) => {
  return new Promise((resolve, reject) => {
    const query = { populate: 'true' }
    const id = options.req ? options.req.params.ID : options.ID
    Tickets.findById(id)

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Ubicaciones') > -1) && {
          strictPopulate: false,
          model: 'Ubicaciones',
          path: 'NombreUbicacion',
          populate: [{ strictPopulate: false, model: 'Zonas', path: 'NombreZona' }],
        }
      )
      .then((ticket) => {
        if (!ticket) {
          return options.res.status(404).send({
            message: 'Ticket not found with id ' + id,
          })
        }
        resolve(paginate.paginate([ticket]))
      })
      .catch((err) => {
        if (err.kind === 'ObjectId') {
          return options.res.status(404).send({
            message: 'Ticket not found with id ' + id,
          })
        }
        return options.res.status(500).send({
          message: 'Error retrieving Ticket with id ' + id,
        })
      })
  })
}

// Update a ticket identified by the ID in the request
exports.update = (options) => {
  return new Promise(async (resolve, reject) => {
    const id = options.req ? options.req.params.ID : options.ID
    const data = options.req ? options.req.body : options.data
    const updatedData = {}

    if (typeof data.FechaPago !== 'undefined') updatedData['FechaPago'] = data.FechaPago

    if (typeof data.NombrePersona !== 'undefined') updatedData['NombrePersona'] = data.NombrePersona

    updatedData['NombreUbicacion'] = {}
    try {
      const Ubicaciones = require('../models/ubicaciones.model.js')
      let ReceivedNombreUbicacion = typeof data.NombreUbicacion === 'string' ? JSON.parse(data.NombreUbicacion) : data.NombreUbicacion
      NombreUbicacioninfo = Array.isArray(ReceivedNombreUbicacion) ? ReceivedNombreUbicacion[0] : ReceivedNombreUbicacion
      if (!NombreUbicacioninfo._id) {
        const NombreUbicacionID = require('mongoose').Types.ObjectId()
        const Ubicacion = new Ubicaciones({ ...NombreUbicacioninfo, _id: NombreUbicacionID })
        Ubicacion.save()
        updatedData['NombreUbicacion'] = NombreUbicacionID
      } else {
        updatedData['NombreUbicacion'] = NombreUbicacioninfo._id
      }
    } catch (e) {
      updatedData['NombreUbicacion'] = data.NombreUbicacion
    }

    // Find Ticket and update it with the request body
    const query = { populate: 'true' }
    Tickets.findByIdAndUpdate(id, updatedData, { new: true })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Ubicaciones') > -1) && {
          strictPopulate: false,
          model: 'Ubicaciones',
          path: 'NombreUbicacion',
          populate: [{ strictPopulate: false, model: 'Zonas', path: 'NombreZona' }],
        }
      )
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// Delete a ticket with the specified ID in the request
exports.delete = (options) => {
  return new Promise((resolve, reject) => {
    const params = options.req ? options.req.params : options
    let theFilter = { _id: params.ID }

    if (options.queryString && options.queryField) {
      theFilter = { [options.queryField]: options.queryString }
    }
    Tickets.deleteMany(theFilter)
      .then((result) => {
        resolve(result)
      })
      .catch((e) => {
        reject(e)
      })
  })
}
