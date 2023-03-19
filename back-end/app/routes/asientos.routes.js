// module.exports = (app) => {
//   const asientos = require('../controllers/asientos.controller.js')

//   // Get all records
//   app.get('/api/asientos', (req, res) => {
//     asientos.findAll({ req, res })
//   })

//   // Search records
//   app.get('/api/asientos/search', (req, res) => {
//     asientos.find({ req, res }).then((result) => {
//       res.send(result)
//     })
//   })

//   // Retrieve a single record
//   app.get('/api/asientos/:ID', (req, res) => {
//     asientos.findOne({ req, res }).then((result) => {
//       res.send(result)
//     })
//   })

//   // Add a record
//   app.post('/api/asientos', (req, res) => {
//     asientos
//       .createAsPromise({ req, res })
//       .then((result) => {
//         res.send(result)
//       })
//       .catch((e) => {
//         res.status(e.code || 500).send(e)
//       })
//   })

//   // Update a record
//   app.put('/api/asientos/:ID', (req, res) => {
//     asientos
//       .update({ req, res })
//       .then((result) => {
//         res.send(result)
//       })
//       .catch((e) => {
//         res.status(500).send(e)
//       })
//   })

//   // Delete a record
//   app.delete('/api/asientos/:ID', (req, res) => {
//     asientos
//       .delete({ req, res })
//       .then((result) => {
//         res.send(result)
//       })
//       .catch((e) => {
//         res.status(500).send(e)
//       })
//   })
// }
