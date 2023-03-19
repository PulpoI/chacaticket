const Zonas = require('../models/zonas.model.js')
const fs = require('fs')
const paginate = require('../paginate')
const errors = require('../services/errors.service')

// Create and Save a new Zona
exports.create = async (options) => {
  const data = options.req ? options.req.body : options.data
  const updatedData = {}

  if (typeof data.Nombre !== 'undefined') updatedData['Nombre'] = data.Nombre

  if (typeof data.Precio !== 'undefined') updatedData['Precio'] = data.Precio

  if (data.NombreEvento === 'null') data.NombreEvento = null
  updatedData['NombreEvento'] = {}
  try {
    const Eventos = require('../models/eventos.model.js')
    let ReceivedNombreEvento = typeof data.NombreEvento === 'string' ? JSON.parse(data.NombreEvento) : data.NombreEvento
    NombreEventoinfo = Array.isArray(ReceivedNombreEvento) ? ReceivedNombreEvento[0] : ReceivedNombreEvento

    if (!NombreEventoinfo._id) {
      const NombreEventoID = require('mongoose').Types.ObjectId()
      const Evento = new Eventos({ ...NombreEventoinfo, _id: NombreEventoID })
      Evento.save()
      updatedData['NombreEvento'] = NombreEventoID
    } else {
      updatedData['NombreEvento'] = NombreEventoinfo._id
    }
  } catch (e) {
    updatedData['NombreEvento'] = data.NombreEvento
  }

  // Create a Zona
  const Zona = new Zonas(updatedData)

  // Save Zona in the database
  Zona.save()
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

    if (typeof data.Nombre !== 'undefined') updatedData['Nombre'] = data.Nombre

    if (typeof data.Precio !== 'undefined') updatedData['Precio'] = data.Precio

    if (data.NombreEvento === 'null') data.NombreEvento = null
    updatedData['NombreEvento'] = {}
    try {
      const Eventos = require('../models/eventos.model.js')
      let ReceivedNombreEvento = typeof data.NombreEvento === 'string' ? JSON.parse(data.NombreEvento) : data.NombreEvento
      NombreEventoinfo = Array.isArray(ReceivedNombreEvento) ? ReceivedNombreEvento[0] : ReceivedNombreEvento

      if (!NombreEventoinfo._id) {
        const NombreEventoID = require('mongoose').Types.ObjectId()
        const Evento = new Eventos({ ...NombreEventoinfo, _id: NombreEventoID })
        Evento.save()
        updatedData['NombreEvento'] = NombreEventoID
      } else {
        updatedData['NombreEvento'] = NombreEventoinfo._id
      }
    } catch (e) {
      updatedData['NombreEvento'] = data.NombreEvento
    }

    // Create a Zona
    const Zona = new Zonas(updatedData)

    // Save Zona in the database
    Zona.save()
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

// Retrieve and return all Zonas from the database.
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

  Zonas.find(findString)
    .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

    .populate(
      (query.populate === 'true' || query.populate?.indexOf('Ubicaciones') > -1) && {
        strictPopulate: false,
        path: 'Ubicaciones',
      }
    )

    .populate(
      (query.populate === 'true' || query.populate?.indexOf('Eventos') > -1) && {
        strictPopulate: false,
        model: 'Eventos',
        path: 'NombreEvento',
        populate: [{ strictPopulate: false, model: 'Users', path: 'NombreLugar' }],
      }
    )
    .then((zonas) => {
      options.res.json(paginate.paginate(zonas, { page: query.page, limit: query.limit || 10 }))
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
      if (Zonas.schema.path(query.searchField).instance === 'Boolean') {
        findString = { [query.searchField]: JSON.parse(query.searchString) }
      } else if (Zonas.schema.path(query.searchField).instance === 'Date') {
        findString = { $expr: { $eq: [query.searchString, { $dateToString: { date: `$${query.searchField}`, format: '%Y-%m-%d' } }] } }
      } else {
        findString = { [query.searchField]: { $regex: new RegExp(query.searchString, 'i') } }
      }

      if (Zonas.schema.path(query.searchField).instance === 'ObjectID' || Zonas.schema.path(query.searchField).instance === 'Array') {
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

    Zonas.find(findString)
      .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Ubicaciones') > -1) && {
          strictPopulate: false,
          path: 'Ubicaciones',
        }
      )

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Eventos') > -1) && {
          strictPopulate: false,
          model: 'Eventos',
          path: 'NombreEvento',
          populate: [{ strictPopulate: false, model: 'Users', path: 'NombreLugar' }],
        }
      )
      .then((zona) => {
        resolve(paginate.paginate(zona, { page: query.page, limit: query.limit || 10 }))
      })
      .catch((err) => {
        options.res.status(500).send({
          message: err.message || 'Some error occurred while retrieving records.',
        })
      })
  })
}

// Find a single Zona with a ID
exports.findOne = (options) => {
  return new Promise((resolve, reject) => {
    const query = { populate: 'true' }
    const id = options.req ? options.req.params.ID : options.ID
    Zonas.findById(id)

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Ubicaciones') > -1) && {
          strictPopulate: false,
          path: 'Ubicaciones',
        }
      )

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Eventos') > -1) && {
          strictPopulate: false,
          model: 'Eventos',
          path: 'NombreEvento',
          populate: [{ strictPopulate: false, model: 'Users', path: 'NombreLugar' }],
        }
      )
      .then((zona) => {
        if (!zona) {
          return options.res.status(404).send({
            message: 'Zona not found with id ' + id,
          })
        }
        resolve(paginate.paginate([zona]))
      })
      .catch((err) => {
        if (err.kind === 'ObjectId') {
          return options.res.status(404).send({
            message: 'Zona not found with id ' + id,
          })
        }
        return options.res.status(500).send({
          message: 'Error retrieving Zona with id ' + id,
        })
      })
  })
}

// Update a zona identified by the ID in the request
exports.update = (options) => {
  return new Promise(async (resolve, reject) => {
    const id = options.req ? options.req.params.ID : options.ID
    const data = options.req ? options.req.body : options.data
    const updatedData = {}

    if (typeof data.Nombre !== 'undefined') updatedData['Nombre'] = data.Nombre

    if (typeof data.Precio !== 'undefined') updatedData['Precio'] = data.Precio

    if (data.NombreEvento === 'null') data.NombreEvento = null
    updatedData['NombreEvento'] = {}
    try {
      const Eventos = require('../models/eventos.model.js')
      let ReceivedNombreEvento = typeof data.NombreEvento === 'string' ? JSON.parse(data.NombreEvento) : data.NombreEvento
      NombreEventoinfo = Array.isArray(ReceivedNombreEvento) ? ReceivedNombreEvento[0] : ReceivedNombreEvento

      if (!NombreEventoinfo._id) {
        const NombreEventoID = require('mongoose').Types.ObjectId()
        const Evento = new Eventos({ ...NombreEventoinfo, _id: NombreEventoID })
        Evento.save()
        updatedData['NombreEvento'] = NombreEventoID
      } else {
        updatedData['NombreEvento'] = NombreEventoinfo._id
      }
    } catch (e) {
      updatedData['NombreEvento'] = data.NombreEvento
    }

    // Find Zona and update it with the request body
    const query = { populate: 'true' }
    Zonas.findByIdAndUpdate(id, updatedData, { new: true })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Ubicaciones') > -1) && {
          strictPopulate: false,
          path: 'Ubicaciones',
        }
      )

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Eventos') > -1) && {
          strictPopulate: false,
          model: 'Eventos',
          path: 'NombreEvento',
          populate: [{ strictPopulate: false, model: 'Users', path: 'NombreLugar' }],
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

// Delete a zona with the specified ID in the request
exports.delete = (options) => {
  return new Promise((resolve, reject) => {
    const params = options.req ? options.req.params : options
    let theFilter = { _id: params.ID }

    if (options.queryString && options.queryField) {
      theFilter = { [options.queryField]: options.queryString }
    }
    Zonas.deleteMany(theFilter)
      .then((result) => {
        resolve(result)
      })
      .catch((e) => {
        reject(e)
      })
  })
}
