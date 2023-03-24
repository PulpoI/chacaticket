const Eventos = require('../models/eventos.model.js')
const fs = require('fs')
const paginate = require('../paginate')
const errors = require('../services/errors.service')

// Create and Save a new Evento
exports.create = async (options) => {
  const data = options.req ? options.req.body : options.data
  const updatedData = {}

  if (typeof data.Nombre !== 'undefined') updatedData['Nombre'] = data.Nombre

  if (typeof data.Fecha !== 'undefined') updatedData['Fecha'] = data.Fecha

  if (typeof data.Hora !== 'undefined') updatedData['Hora'] = data.Hora

  if (options.req.files && options.req.files.Imagen && options.req.files.Imagen.data) {
    if (!fs.existsSync(`${options.req.app.get('filesFolder')}`)) fs.mkdirSync(`${options.req.app.get('filesFolder')}`, { recursive: true })
    fs.writeFileSync(`${options.req.app.get('filesFolder')}/${options.req.files.Imagen.name}`, options.req.files.Imagen.data)
    updatedData['Imagen'] = options.req.files.Imagen.name
  }
  if (data.NombreLugar === 'null') data.NombreLugar = null
  updatedData['NombreLugar'] = {}
  try {
    const Users = require('../models/users.model.js')
    let ReceivedNombreLugar = typeof data.NombreLugar === 'string' ? JSON.parse(data.NombreLugar) : data.NombreLugar
    NombreLugarinfo = Array.isArray(ReceivedNombreLugar) ? ReceivedNombreLugar[0] : ReceivedNombreLugar

    if (!NombreLugarinfo._id) {
      const NombreLugarID = require('mongoose').Types.ObjectId()
      const Usersrecord = new Users({ ...NombreLugarinfo, _id: NombreLugarID })
      Usersrecord.save()
      updatedData['NombreLugar'] = NombreLugarID
    } else {
      updatedData['NombreLugar'] = NombreLugarinfo._id
    }
  } catch (e) {
    updatedData['NombreLugar'] = data.NombreLugar
  }

  // Create a Evento
  const Evento = new Eventos(updatedData)

  // Save Evento in the database
  Evento.save()
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

    if (typeof data.Fecha !== 'undefined') updatedData['Fecha'] = data.Fecha

    if (typeof data.Hora !== 'undefined') updatedData['Hora'] = data.Hora

    if (options.req.files && options.req.files.Imagen && options.req.files.Imagen.data) {
      if (!fs.existsSync(`${options.req.app.get('filesFolder')}`)) fs.mkdirSync(`${options.req.app.get('filesFolder')}`, { recursive: true })
      fs.writeFileSync(`${options.req.app.get('filesFolder')}/${options.req.files.Imagen.name}`, options.req.files.Imagen.data)
      updatedData['Imagen'] = options.req.files.Imagen.name
    }
    if (data.NombreLugar === 'null') data.NombreLugar = null
    updatedData['NombreLugar'] = {}
    try {
      const Users = require('../models/users.model.js')
      let ReceivedNombreLugar = typeof data.NombreLugar === 'string' ? JSON.parse(data.NombreLugar) : data.NombreLugar
      NombreLugarinfo = Array.isArray(ReceivedNombreLugar) ? ReceivedNombreLugar[0] : ReceivedNombreLugar

      if (!NombreLugarinfo._id) {
        const NombreLugarID = require('mongoose').Types.ObjectId()
        const Usersrecord = new Users({ ...NombreLugarinfo, _id: NombreLugarID })
        Usersrecord.save()
        updatedData['NombreLugar'] = NombreLugarID
      } else {
        updatedData['NombreLugar'] = NombreLugarinfo._id
      }
    } catch (e) {
      updatedData['NombreLugar'] = data.NombreLugar
    }

    // Create a Evento
    const Evento = new Eventos(updatedData)

    // Save Evento in the database
    Evento.save()
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

// Retrieve and return all Eventos from the database.
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

  Eventos.find(findString)
    .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

    .populate(
      (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
        strictPopulate: false,
        path: 'Zonas',
        populate: [{ model: 'Tickets', path: 'Tickets', strictPopulate: false }],
      }
    )

    .populate(
      (query.populate === 'true' || query.populate?.indexOf('Users') > -1) && {
        strictPopulate: false,
        model: 'Users',
        path: 'NombreLugar',
      }
    )
    .then((eventos) => {
      options.res.json(paginate.paginate(eventos, { page: query.page, limit: query.limit || 10 }))
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
      if (Eventos.schema.path(query.searchField).instance === 'Boolean') {
        findString = { [query.searchField]: JSON.parse(query.searchString) }
      } else if (Eventos.schema.path(query.searchField).instance === 'Date') {
        findString = { $expr: { $eq: [query.searchString, { $dateToString: { date: `$${query.searchField}`, format: '%Y-%m-%d' } }] } }
      } else {
        if (query.exactMatch) {
          findString = { [query.searchField]: query.searchString }
        } else {
          findString = { [query.searchField]: { $regex: new RegExp(query.searchString, 'i') } }
        }
      }

      if (Eventos.schema.path(query.searchField).instance === 'ObjectID' || Eventos.schema.path(query.searchField).instance === 'Array') {
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

    Eventos.find(findString)
      .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
          strictPopulate: false,
          path: 'Zonas',
          populate: [{ model: 'Tickets', path: 'Tickets', strictPopulate: false }],
        }
      )

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Users') > -1) && {
          strictPopulate: false,
          model: 'Users',
          path: 'NombreLugar',
        }
      )
      .then((evento) => {
        resolve(paginate.paginate(evento, { page: query.page, limit: query.limit || 10 }))
      })
      .catch((err) => {
        options.res.status(500).send({
          message: err.message || 'Some error occurred while retrieving records.',
        })
      })
  })
}

// Find a single Evento with a ID
exports.findOne = (options) => {
  return new Promise((resolve, reject) => {
    const query = { populate: 'true' }
    const id = options.req ? options.req.params.ID : options.ID
    Eventos.findById(id)

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
          strictPopulate: false,
          path: 'Zonas',
          populate: [{ model: 'Tickets', path: 'Tickets', strictPopulate: false }],
        }
      )

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Users') > -1) && {
          strictPopulate: false,
          model: 'Users',
          path: 'NombreLugar',
        }
      )
      .then((evento) => {
        if (!evento) {
          return options.res.status(404).send({
            message: 'Evento not found with id ' + id,
          })
        }
        resolve(paginate.paginate([evento]))
      })
      .catch((err) => {
        if (err.kind === 'ObjectId') {
          return options.res.status(404).send({
            message: 'Evento not found with id ' + id,
          })
        }
        return options.res.status(500).send({
          message: 'Error retrieving Evento with id ' + id,
        })
      })
  })
}

// Update a evento identified by the ID in the request
exports.update = (options) => {
  return new Promise(async (resolve, reject) => {
    const id = options.req ? options.req.params.ID : options.ID
    const data = options.req ? options.req.body : options.data
    const updatedData = {}

    if (typeof data.Nombre !== 'undefined') updatedData['Nombre'] = data.Nombre

    if (typeof data.Fecha !== 'undefined') updatedData['Fecha'] = data.Fecha

    if (typeof data.Hora !== 'undefined') updatedData['Hora'] = data.Hora

    if (options.req.files && options.req.files.Imagen && options.req.files.Imagen.data) {
      if (!fs.existsSync(`${options.req.app.get('filesFolder')}`)) fs.mkdirSync(`${options.req.app.get('filesFolder')}`, { recursive: true })
      fs.writeFileSync(`${options.req.app.get('filesFolder')}/${options.req.files.Imagen.name}`, options.req.files.Imagen.data)
      updatedData['Imagen'] = options.req.files.Imagen.name
    }
    if (data.NombreLugar === 'null') data.NombreLugar = null
    updatedData['NombreLugar'] = {}
    try {
      const Users = require('../models/users.model.js')
      let ReceivedNombreLugar = typeof data.NombreLugar === 'string' ? JSON.parse(data.NombreLugar) : data.NombreLugar
      NombreLugarinfo = Array.isArray(ReceivedNombreLugar) ? ReceivedNombreLugar[0] : ReceivedNombreLugar

      if (!NombreLugarinfo._id) {
        const NombreLugarID = require('mongoose').Types.ObjectId()
        const Usersrecord = new Users({ ...NombreLugarinfo, _id: NombreLugarID })
        Usersrecord.save()
        updatedData['NombreLugar'] = NombreLugarID
      } else {
        updatedData['NombreLugar'] = NombreLugarinfo._id
      }
    } catch (e) {
      updatedData['NombreLugar'] = data.NombreLugar
    }

    // Find Evento and update it with the request body
    const query = { populate: 'true' }
    Eventos.findByIdAndUpdate(id, updatedData, { new: true })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
          strictPopulate: false,
          path: 'Zonas',
          populate: [{ model: 'Tickets', path: 'Tickets', strictPopulate: false }],
        }
      )

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Users') > -1) && {
          strictPopulate: false,
          model: 'Users',
          path: 'NombreLugar',
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

// Delete a evento with the specified ID in the request
exports.delete = (options) => {
  return new Promise((resolve, reject) => {
    const params = options.req ? options.req.params : options
    let theFilter = { _id: params.ID }

    if (options.queryString && options.queryField) {
      theFilter = { [options.queryField]: options.queryString }
    }
    Eventos.deleteMany(theFilter)
      .then((result) => {
        resolve(result)
      })
      .catch((e) => {
        reject(e)
      })
  })
}
