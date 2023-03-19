// const Precios = require('../models/precios.model.js')
// const fs = require('fs')
// const paginate = require('../paginate')
// const errors = require('../services/errors.service')

// // Create and Save a new Precio
// exports.create = async (options) => {
//   const data = options.req ? options.req.body : options.data
//   const updatedData = {}

//   if (typeof data.Precio !== 'undefined') updatedData['Precio'] = data.Precio

//   if (data.nombreZona === 'null') data.nombreZona = null
//   updatedData['nombreZona'] = {}
//   try {
//     const Zonas = require('../models/zonas.model.js')
//     let ReceivednombreZona = typeof data.nombreZona === 'string' ? JSON.parse(data.nombreZona) : data.nombreZona
//     nombreZonainfo = Array.isArray(ReceivednombreZona) ? ReceivednombreZona[0] : ReceivednombreZona

//     if (!nombreZonainfo._id) {
//       const nombreZonaID = require('mongoose').Types.ObjectId()
//       const Zona = new Zonas({ ...nombreZonainfo, _id: nombreZonaID })
//       Zona.save()
//       updatedData['nombreZona'] = nombreZonaID
//     } else {
//       updatedData['nombreZona'] = nombreZonainfo._id
//     }
//   } catch (e) {
//     updatedData['nombreZona'] = data.nombreZona
//   }

//   // Create a Precio
//   const Precio = new Precios(updatedData)

//   // Save Precio in the database
//   Precio.save()
//     .then((data) => {
//       exports.findOne({ ID: data._id, res: options.res })
//     })
//     .catch((err) => {
//       options.res.status(500).send({
//         message: err.message || 'Some error occurred while saving the record.',
//       })
//     })
// }

// exports.createAsPromise = (options) => {
//   return new Promise(async (resolve, reject) => {
//     const data = options.req ? options.req.body : options.data
//     const updatedData = {}
//     if (data._id) updatedData._id = data._id

//     if (typeof data.Precio !== 'undefined') updatedData['Precio'] = data.Precio

//     if (data.nombreZona === 'null') data.nombreZona = null
//     updatedData['nombreZona'] = {}
//     try {
//       const Zonas = require('../models/zonas.model.js')
//       let ReceivednombreZona = typeof data.nombreZona === 'string' ? JSON.parse(data.nombreZona) : data.nombreZona
//       nombreZonainfo = Array.isArray(ReceivednombreZona) ? ReceivednombreZona[0] : ReceivednombreZona

//       if (!nombreZonainfo._id) {
//         const nombreZonaID = require('mongoose').Types.ObjectId()
//         const Zona = new Zonas({ ...nombreZonainfo, _id: nombreZonaID })
//         Zona.save()
//         updatedData['nombreZona'] = nombreZonaID
//       } else {
//         updatedData['nombreZona'] = nombreZonainfo._id
//       }
//     } catch (e) {
//       updatedData['nombreZona'] = data.nombreZona
//     }

//     // Create a Precio
//     const Precio = new Precios(updatedData)

//     // Save Precio in the database
//     Precio.save()
//       .then((result) => {
//         if (options.skipfind) {
//           resolve(result)
//         } else {
//           exports.findOne({ ID: result._id, res: options.res }).then((result) => {
//             resolve(result)
//           })
//         }
//       })
//       .catch((err) => {
//         reject(errors.prepareError(err))
//       })
//   })
// }

// // Retrieve and return all Precios from the database.
// exports.findAll = (options) => {
//   const query = options.query ? options.query : options.req.query
//   if (typeof query.populate === 'undefined') query.populate = 'true'
//   const data = options.req ? options.req.body : options.data
//   if (typeof query.sort === 'string') query.sort = JSON.parse(query.sort)

//   const findString = {}
//   if (query.fixedSearch) {
//     query.fixedSearch = JSON.parse(query.fixedSearch)
//     findString[query.fixedSearch.field] = { $regex: new RegExp(query.fixedSearch.value, 'i') }
//   }

//   Precios.find(findString)
//     .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

//     .populate(
//       (query.populate === 'true' || query.populate?.indexOf('Asientos') > -1) && {
//         strictPopulate: false,
//         path: 'Asientos',
//         populate: [{ model: 'Tickets', path: 'Tickets', strictPopulate: false }],
//       }
//     )

//     .populate(
//       (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
//         strictPopulate: false,
//         model: 'Zonas',
//         path: 'nombreZona',
//         populate: [{ strictPopulate: false, model: 'Eventos', path: 'nombreEvento' }],
//       }
//     )
//     .then((precios) => {
//       options.res.json(paginate.paginate(precios, { page: query.page, limit: query.limit || 10 }))
//     })
//     .catch((err) => {
//       options.res.status(500).send({
//         message: err.message || 'Some error occurred while retrieving records.',
//       })
//     })
// }

// exports.find = (options) => {
//   return new Promise((resolve, reject) => {
//     const query = options.query ? options.query : options.req.query
//     const data = options.req ? options.req.body : options.data
//     let findString = query.searchString ? { $text: { $search: query.searchString } } : {}
//     if (query.searchField) {
//       if (Precios.schema.path(query.searchField).instance === 'Boolean') {
//         findString = { [query.searchField]: JSON.parse(query.searchString) }
//       } else if (Precios.schema.path(query.searchField).instance === 'Date') {
//         findString = { $expr: { $eq: [query.searchString, { $dateToString: { date: `$${query.searchField}`, format: '%Y-%m-%d' } }] } }
//       } else {
//         findString = { [query.searchField]: { $regex: new RegExp(query.searchString, 'i') } }
//       }

//       if (Precios.schema.path(query.searchField).instance === 'ObjectID' || Precios.schema.path(query.searchField).instance === 'Array') {
//         findString = { [query.searchField]: require('mongoose').Types.ObjectId(query.searchString) }
//       }
//     } else if (query.filters) {
//       query.filters.forEach((filter) => {
//         const parsed = typeof filter === 'string' ? JSON.parse(filter) : filter
//         findString[parsed.field] = parsed.value
//       })
//     }
//     if (typeof query.sort === 'string') query.sort = JSON.parse(query.sort)

//     if (query.fixedSearch) {
//       query.fixedSearch = JSON.parse(query.fixedSearch)
//       findString[query.fixedSearch.field] = { $regex: new RegExp(query.fixedSearch.value, 'i') }
//     }

//     Precios.find(findString)
//       .sort(query.sort && { [query.sort.field]: query.sort.method === 'desc' ? -1 : 1 })

//       .populate(
//         (query.populate === 'true' || query.populate?.indexOf('Asientos') > -1) && {
//           strictPopulate: false,
//           path: 'Asientos',
//           populate: [{ model: 'Tickets', path: 'Tickets', strictPopulate: false }],
//         }
//       )

//       .populate(
//         (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
//           strictPopulate: false,
//           model: 'Zonas',
//           path: 'nombreZona',
//           populate: [{ strictPopulate: false, model: 'Eventos', path: 'nombreEvento' }],
//         }
//       )
//       .then((precio) => {
//         resolve(paginate.paginate(precio, { page: query.page, limit: query.limit || 10 }))
//       })
//       .catch((err) => {
//         options.res.status(500).send({
//           message: err.message || 'Some error occurred while retrieving records.',
//         })
//       })
//   })
// }

// // Find a single Precio with a ID
// exports.findOne = (options) => {
//   return new Promise((resolve, reject) => {
//     const query = { populate: 'true' }
//     const id = options.req ? options.req.params.ID : options.ID
//     Precios.findById(id)

//       .populate(
//         (query.populate === 'true' || query.populate?.indexOf('Asientos') > -1) && {
//           strictPopulate: false,
//           path: 'Asientos',
//           populate: [{ model: 'Tickets', path: 'Tickets', strictPopulate: false }],
//         }
//       )

//       .populate(
//         (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
//           strictPopulate: false,
//           model: 'Zonas',
//           path: 'nombreZona',
//           populate: [{ strictPopulate: false, model: 'Eventos', path: 'nombreEvento' }],
//         }
//       )
//       .then((precio) => {
//         if (!precio) {
//           return options.res.status(404).send({
//             message: 'Precio not found with id ' + id,
//           })
//         }
//         resolve(paginate.paginate([precio]))
//       })
//       .catch((err) => {
//         if (err.kind === 'ObjectId') {
//           return options.res.status(404).send({
//             message: 'Precio not found with id ' + id,
//           })
//         }
//         return options.res.status(500).send({
//           message: 'Error retrieving Precio with id ' + id,
//         })
//       })
//   })
// }

// // Update a precio identified by the ID in the request
// exports.update = (options) => {
//   return new Promise(async (resolve, reject) => {
//     const id = options.req ? options.req.params.ID : options.ID
//     const data = options.req ? options.req.body : options.data
//     const updatedData = {}

//     if (typeof data.Precio !== 'undefined') updatedData['Precio'] = data.Precio

//     if (data.nombreZona === 'null') data.nombreZona = null
//     updatedData['nombreZona'] = {}
//     try {
//       const Zonas = require('../models/zonas.model.js')
//       let ReceivednombreZona = typeof data.nombreZona === 'string' ? JSON.parse(data.nombreZona) : data.nombreZona
//       nombreZonainfo = Array.isArray(ReceivednombreZona) ? ReceivednombreZona[0] : ReceivednombreZona

//       if (!nombreZonainfo._id) {
//         const nombreZonaID = require('mongoose').Types.ObjectId()
//         const Zona = new Zonas({ ...nombreZonainfo, _id: nombreZonaID })
//         Zona.save()
//         updatedData['nombreZona'] = nombreZonaID
//       } else {
//         updatedData['nombreZona'] = nombreZonainfo._id
//       }
//     } catch (e) {
//       updatedData['nombreZona'] = data.nombreZona
//     }

//     // Find Precio and update it with the request body
//     const query = { populate: 'true' }
//     Precios.findByIdAndUpdate(id, updatedData, { new: true })

//       .populate(
//         (query.populate === 'true' || query.populate?.indexOf('Asientos') > -1) && {
//           strictPopulate: false,
//           path: 'Asientos',
//           populate: [{ model: 'Tickets', path: 'Tickets', strictPopulate: false }],
//         }
//       )

//       .populate(
//         (query.populate === 'true' || query.populate?.indexOf('Zonas') > -1) && {
//           strictPopulate: false,
//           model: 'Zonas',
//           path: 'nombreZona',
//           populate: [{ strictPopulate: false, model: 'Eventos', path: 'nombreEvento' }],
//         }
//       )
//       .then((result) => {
//         resolve(result)
//       })
//       .catch((err) => {
//         reject(err)
//       })
//   })
// }

// // Delete a precio with the specified ID in the request
// exports.delete = (options) => {
//   return new Promise((resolve, reject) => {
//     const params = options.req ? options.req.params : options
//     let theFilter = { _id: params.ID }

//     if (options.queryString && options.queryField) {
//       theFilter = { [options.queryField]: options.queryString }
//     }
//     Precios.deleteMany(theFilter)
//       .then((result) => {
//         resolve(result)
//       })
//       .catch((e) => {
//         reject(e)
//       })
//   })
// }
