// module.exports = (app) => {
//   const precios = require('../controllers/precios.controller.js')

//   // Get all records
//   app.get('/api/precios', (req, res) => {
//     precios.findAll({ req, res })
//   })

//   // Search records
//   app.get('/api/precios/search', (req, res) => {
//     precios.find({ req, res }).then((result) => {
//       res.send(result)
//     })
//   })

//   // Retrieve a single record
//   app.get('/api/precios/:ID', (req, res) => {
//     precios.findOne({ req, res }).then((result) => {
//       res.send(result)
//     })
//   })

//   // Add a record
//   app.post('/api/precios', (req, res) => {
//     precios
//       .createAsPromise({ req, res })
//       .then((result) => {
//         res.send(result)
//       })
//       .catch((e) => {
//         res.status(e.code || 500).send(e)
//       })
//   })

//   // Update a record
//   app.put('/api/precios/:ID', (req, res) => {
//     precios
//       .update({ req, res })
//       .then((result) => {
//         res.send(result)
//       })
//       .catch((e) => {
//         res.status(500).send(e)
//       })
//   })

//   // Delete a record
//   app.delete('/api/precios/:ID', (req, res) => {
//     precios
//       .delete({ req, res })
//       .then((result) => {
//         res.send(result)
//       })
//       .catch((e) => {
//         res.status(500).send(e)
//       })
//   })
// }
