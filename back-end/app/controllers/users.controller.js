const Users = require('../models/users.model.js')
const fs = require('fs')
const paginate = require('../paginate')
const errors = require('../services/errors.service')

const bcrypt = require('bcryptjs')

// Create and Save a new Usersrecord
exports.create = async (options) => {
  const data = options.req ? options.req.body : options.data
  const updatedData = {}

  if (typeof data.FirstName !== 'undefined') updatedData['FirstName'] = data.FirstName

  if (typeof data.LastName !== 'undefined') updatedData['LastName'] = data.LastName

  if (typeof data.Email !== 'undefined') updatedData['Email'] = data.Email

  if (data.Password) updatedData['Password'] = bcrypt.hashSync(data.Password, 10)

  if (options.req.files && options.req.files.ProfilePic && options.req.files.ProfilePic.data) {
    if (!fs.existsSync(`${options.req.app.get('filesFolder')}`)) fs.mkdirSync(`${options.req.app.get('filesFolder')}`, { recursive: true })
    fs.writeFileSync(`${options.req.app.get('filesFolder')}/${options.req.files.ProfilePic.name}`, options.req.files.ProfilePic.data)
    updatedData['ProfilePic'] = options.req.files.ProfilePic.name
  }
  if (typeof data.Role !== 'undefined') updatedData['Role'] = data.Role

  if (typeof data.Lugar !== 'undefined') updatedData['Lugar'] = data.Lugar

  if (typeof data.DireccionLugar !== 'undefined') updatedData['DireccionLugar'] = data.DireccionLugar

  // Create a Usersrecord
  const Usersrecord = new Users(updatedData)

  // Save Usersrecord in the database
  Usersrecord.save()
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

    if (typeof data.FirstName !== 'undefined') updatedData['FirstName'] = data.FirstName

    if (typeof data.LastName !== 'undefined') updatedData['LastName'] = data.LastName

    if (typeof data.Email !== 'undefined') updatedData['Email'] = data.Email

    if (data.Password) updatedData['Password'] = bcrypt.hashSync(data.Password, 10)

    if (options.req.files && options.req.files.ProfilePic && options.req.files.ProfilePic.data) {
      if (!fs.existsSync(`${options.req.app.get('filesFolder')}`)) fs.mkdirSync(`${options.req.app.get('filesFolder')}`, { recursive: true })
      fs.writeFileSync(`${options.req.app.get('filesFolder')}/${options.req.files.ProfilePic.name}`, options.req.files.ProfilePic.data)
      updatedData['ProfilePic'] = options.req.files.ProfilePic.name
    }
    if (typeof data.Role !== 'undefined') updatedData['Role'] = data.Role

    if (typeof data.Lugar !== 'undefined') updatedData['Lugar'] = data.Lugar

    if (typeof data.DireccionLugar !== 'undefined') updatedData['DireccionLugar'] = data.DireccionLugar

    // Create a Usersrecord
    const Usersrecord = new Users(updatedData)

    // Save Usersrecord in the database
    Usersrecord.save()
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

// Retrieve and return all Users from the database.
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

  Users.find(findString)
    .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

    .populate(
      (query.populate === 'true' || query.populate?.indexOf('Eventos') > -1) && {
        strictPopulate: false,
        path: 'Eventos',
        populate: [{ model: 'Zonas', path: 'Zonas', strictPopulate: false }],
      }
    )

    .then((users) => {
      options.res.json(paginate.paginate(users, { page: query.page, limit: query.limit || 10 }))
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
      if (Users.schema.path(query.searchField).instance === 'Boolean') {
        findString = { [query.searchField]: JSON.parse(query.searchString) }
      } else if (Users.schema.path(query.searchField).instance === 'Date') {
        findString = { $expr: { $eq: [query.searchString, { $dateToString: { date: `$${query.searchField}`, format: '%Y-%m-%d' } }] } }
      } else {
        findString = { [query.searchField]: { $regex: new RegExp(query.searchString, 'i') } }
      }

      if (Users.schema.path(query.searchField).instance === 'ObjectID' || Users.schema.path(query.searchField).instance === 'Array') {
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

    Users.find(findString)
      .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Eventos') > -1) && {
          strictPopulate: false,
          path: 'Eventos',
          populate: [{ model: 'Zonas', path: 'Zonas', strictPopulate: false }],
        }
      )

      .then((usersrecord) => {
        resolve(paginate.paginate(usersrecord, { page: query.page, limit: query.limit || 10 }))
      })
      .catch((err) => {
        options.res.status(500).send({
          message: err.message || 'Some error occurred while retrieving records.',
        })
      })
  })
}

// Find a single Usersrecord with a ID
exports.findOne = (options) => {
  return new Promise((resolve, reject) => {
    const query = { populate: 'true' }
    const id = options.req ? options.req.params.ID : options.ID
    Users.findById(id)

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Eventos') > -1) && {
          strictPopulate: false,
          path: 'Eventos',
          populate: [{ model: 'Zonas', path: 'Zonas', strictPopulate: false }],
        }
      )

      .then((usersrecord) => {
        if (!usersrecord) {
          return options.res.status(404).send({
            message: 'Usersrecord not found with id ' + id,
          })
        }
        resolve(paginate.paginate([usersrecord]))
      })
      .catch((err) => {
        if (err.kind === 'ObjectId') {
          return options.res.status(404).send({
            message: 'Usersrecord not found with id ' + id,
          })
        }
        return options.res.status(500).send({
          message: 'Error retrieving Usersrecord with id ' + id,
        })
      })
  })
}

// Update a usersrecord identified by the ID in the request
exports.update = (options) => {
  return new Promise(async (resolve, reject) => {
    const id = options.req ? options.req.params.ID : options.ID
    const data = options.req ? options.req.body : options.data
    const updatedData = {}

    if (typeof data.FirstName !== 'undefined') updatedData['FirstName'] = data.FirstName

    if (typeof data.LastName !== 'undefined') updatedData['LastName'] = data.LastName

    if (typeof data.Email !== 'undefined') updatedData['Email'] = data.Email

    if (data.Password) updatedData['Password'] = bcrypt.hashSync(data.Password, 10)

    if (options.req.files && options.req.files.ProfilePic && options.req.files.ProfilePic.data) {
      if (!fs.existsSync(`${options.req.app.get('filesFolder')}`)) fs.mkdirSync(`${options.req.app.get('filesFolder')}`, { recursive: true })
      fs.writeFileSync(`${options.req.app.get('filesFolder')}/${options.req.files.ProfilePic.name}`, options.req.files.ProfilePic.data)
      updatedData['ProfilePic'] = options.req.files.ProfilePic.name
    }
    if (typeof data.Role !== 'undefined') updatedData['Role'] = data.Role

    if (typeof data.Lugar !== 'undefined') updatedData['Lugar'] = data.Lugar

    if (typeof data.DireccionLugar !== 'undefined') updatedData['DireccionLugar'] = data.DireccionLugar

    // Find Usersrecord and update it with the request body
    const query = { populate: 'true' }
    Users.findByIdAndUpdate(id, updatedData, { new: true })

      .populate(
        (query.populate === 'true' || query.populate?.indexOf('Eventos') > -1) && {
          strictPopulate: false,
          path: 'Eventos',
          populate: [{ model: 'Zonas', path: 'Zonas', strictPopulate: false }],
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

// Delete a usersrecord with the specified ID in the request
exports.delete = (options) => {
  return new Promise((resolve, reject) => {
    const params = options.req ? options.req.params : options
    let theFilter = { _id: params.ID }

    if (options.queryString && options.queryField) {
      theFilter = { [options.queryField]: options.queryString }
    }
    Users.deleteMany(theFilter)
      .then((result) => {
        resolve(result)
      })
      .catch((e) => {
        reject(e)
      })
  })
}
