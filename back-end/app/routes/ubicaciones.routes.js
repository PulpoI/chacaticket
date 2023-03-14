module.exports = (app) => {
  const ubicaciones = require('../controllers/ubicaciones.controller.js')

  // Get all records
  app.get('/api/ubicaciones', (req, res) => {
    ubicaciones.findAll({ req, res })
  })

  // Search records
  app.get('/api/ubicaciones/search', (req, res) => {
    ubicaciones.find({ req, res }).then((result) => {
      res.send(result)
    })
  })

  // Retrieve a single record
  app.get('/api/ubicaciones/:ID', (req, res) => {
    ubicaciones.findOne({ req, res }).then((result) => {
      res.send(result)
    })
  })

  // Add a record
  app.post('/api/ubicaciones', (req, res) => {
    ubicaciones
      .createAsPromise({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(e.code || 500).send(e)
      })
  })

  // Update a record
  app.put('/api/ubicaciones/:ID', (req, res) => {
    ubicaciones
      .update({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })

  // Delete a record
  app.delete('/api/ubicaciones/:ID', (req, res) => {
    ubicaciones
      .delete({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })
}
