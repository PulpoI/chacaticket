const Asientos = require('../models/asientos.model.js')
const fs = require('fs')
const paginate = require('../paginate')
const errors = require('../services/errors.service')

// Create and Save a new Asiento
exports.create = async (options) => {
  const data = options.req ? options.req.body : options.data
  const updatedData = {}

  // unique validation

  if (typeof data.Ubicacion !== 'undefined') updatedData['Ubicacion'] = data.Ubicacion

  if (data.NombreZona === 'null') data.NombreZona = null
  updatedData['NombreZona'] = {}
  try {
    const Zonas = require('../models/zonas.model.js')
    let ReceivedNombreZona = typeof data.NombreZona === 'string' ? JSON.parse(data.NombreZona) : data.NombreZona
    NombreZonainfo = Array.isArray(ReceivedNombreZona) ? ReceivedNombreZona[0] : ReceivedNombreZona

    if (!NombreZonainfo._id) {
      const NombreZonaID = require('mongoose').Types.ObjectId()
      const Zona = new Zonas({ ...NombreZonainfo, _id: NombreZonaID })
      Zona.save()
      updatedData['NombreZona'] = NombreZonaID
    } else {
      updatedData['NombreZona'] = NombreZonainfo._id
    }
  } catch (e) {
    updatedData['NombreZona'] = data.NombreZona
  }

  // Create a Asiento
  const Asiento = new Asientos(updatedData)

  // Save Asiento in the database
  Asiento.save()
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

    // unique validation

    if (typeof data.Ubicacion !== 'undefined') updatedData['Ubicacion'] = data.Ubicacion

    if (data.NombreZona === 'null') data.NombreZona = null
    updatedData['NombreZona'] = {}
    try {
      const Zonas = require('../models/zonas.model.js')
      let ReceivedNombreZona = typeof data.NombreZona === 'string' ? JSON.parse(data.NombreZona) : data.NombreZona
      NombreZonainfo = Array.isArray(ReceivedNombreZona) ? ReceivedNombreZona[0] : ReceivedNombreZona

      if (!NombreZonainfo._id) {
        const NombreZonaID = require('mongoose').Types.ObjectId()
        const Zona = new Zonas({ ...NombreZonainfo, _id: NombreZonaID })
        Zona.save()
        updatedData['NombreZona'] = NombreZonaID
      } else {
        updatedData['NombreZona'] = NombreZonainfo._id
      }
    } catch (e) {
      updatedData['NombreZona'] = data.NombreZona
    }

    // Create a Asiento
    const Asiento = new Asientos(updatedData)

    // Save Asiento in the database
    Asiento.save()
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

// Retrieve and return all Asientos from the database.
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

  Asientos.find(findString)
    .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

    .populate(
      (query.populate === 'true' || query.populate?.indexOf('Tickets') > -1) && {
        strictPopulate: false,
        path: 'Tickets',
      }
    )

    .populate(
      (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
        strictPopulate: false,
        model: 'Zonas',
        path: 'NombreZona',
        populate: [{ strictPopulate: false, model: 'Eventos', path: 'NombreEvento' }],
      }
    )
    .then((asientos) => {
      options.res.json(paginate.paginate(asientos, { page: query.page, limit: query.limit || 10 }))
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
      if (Asientos.schema.path(query.searchField).instance === 'Boolean') {
        findString = { [query.searchField]: JSON.parse(query.searchString) }
      } else if (Asientos.schema.path(query.searchField).instance === 'Date') {
        findString = { $expr: { $eq: [query.searchString, { $dateToString: { date: `$${query.searchField}`, format: '%Y-%m-%d' } }] } }
      } else {
        findString = { [query.searchField]: { $regex: new RegExp(query.searchString, 'i') } }
      }

      if (Asientos.schema.path(query.searchField).instance === 'ObjectID' || Asientos.schema.path(query.searchField).instance === 'Array') {
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

    Asientos.find(findString)
      .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Tickets') > -1) && {
          strictPopulate: false,
          path: 'Tickets',
        }
      )

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
          strictPopulate: false,
          model: 'Zonas',
          path: 'NombreZona',
          populate: [{ strictPopulate: false, model: 'Eventos', path: 'NombreEvento' }],
        }
      )
      .then((asiento) => {
        resolve(paginate.paginate(asiento, { page: query.page, limit: query.limit || 10 }))
      })
      .catch((err) => {
        options.res.status(500).send({
          message: err.message || 'Some error occurred while retrieving records.',
        })
      })
  })
}

// Find a single Asiento with a ID
exports.findOne = (options) => {
  return new Promise((resolve, reject) => {
    const query = { populate: 'true' }
    const id = options.req ? options.req.params.ID : options.ID
    Asientos.findById(id)

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Tickets') > -1) && {
          strictPopulate: false,
          path: 'Tickets',
        }
      )

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
          strictPopulate: false,
          model: 'Zonas',
          path: 'NombreZona',
          populate: [{ strictPopulate: false, model: 'Eventos', path: 'NombreEvento' }],
        }
      )
      .then((asiento) => {
        if (!asiento) {
          return options.res.status(404).send({
            message: 'Asiento not found with id ' + id,
          })
        }
        resolve(paginate.paginate([asiento]))
      })
      .catch((err) => {
        if (err.kind === 'ObjectId') {
          return options.res.status(404).send({
            message: 'Asiento not found with id ' + id,
          })
        }
        return options.res.status(500).send({
          message: 'Error retrieving Asiento with id ' + id,
        })
      })
  })
}

// Update a asiento identified by the ID in the request
exports.update = (options) => {
  return new Promise(async (resolve, reject) => {
    const id = options.req ? options.req.params.ID : options.ID
    const data = options.req ? options.req.body : options.data
    const updatedData = {}

    if (typeof data.Ubicacion !== 'undefined') updatedData['Ubicacion'] = data.Ubicacion

    if (data.NombreZona === 'null') data.NombreZona = null
    updatedData['NombreZona'] = {}
    try {
      const Zonas = require('../models/zonas.model.js')
      let ReceivedNombreZona = typeof data.NombreZona === 'string' ? JSON.parse(data.NombreZona) : data.NombreZona
      NombreZonainfo = Array.isArray(ReceivedNombreZona) ? ReceivedNombreZona[0] : ReceivedNombreZona

      if (!NombreZonainfo._id) {
        const NombreZonaID = require('mongoose').Types.ObjectId()
        const Zona = new Zonas({ ...NombreZonainfo, _id: NombreZonaID })
        Zona.save()
        updatedData['NombreZona'] = NombreZonaID
      } else {
        updatedData['NombreZona'] = NombreZonainfo._id
      }
    } catch (e) {
      updatedData['NombreZona'] = data.NombreZona
    }

    // Find Asiento and update it with the request body
    const query = { populate: 'true' }
    Asientos.findByIdAndUpdate(id, updatedData, { new: true })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Tickets') > -1) && {
          strictPopulate: false,
          path: 'Tickets',
        }
      )

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
          strictPopulate: false,
          model: 'Zonas',
          path: 'NombreZona',
          populate: [{ strictPopulate: false, model: 'Eventos', path: 'NombreEvento' }],
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

// Delete a asiento with the specified ID in the request
exports.delete = (options) => {
  return new Promise((resolve, reject) => {
    const params = options.req ? options.req.params : options
    let theFilter = { _id: params.ID }

    if (options.queryString && options.queryField) {
      theFilter = { [options.queryField]: options.queryString }
    }
    Asientos.deleteMany(theFilter)
      .then((result) => {
        resolve(result)
      })
      .catch((e) => {
        reject(e)
      })
  })
}
