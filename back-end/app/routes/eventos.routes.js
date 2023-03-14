module.exports = (app) => {
  const eventos = require('../controllers/eventos.controller.js')

  // Get all records
  app.get('/api/eventos', (req, res) => {
    eventos.findAll({ req, res })
  })

  // Search records
  app.get('/api/eventos/search', (req, res) => {
    eventos.find({ req, res }).then((result) => {
      res.send(result)
    })
  })

  // Retrieve a single record
  app.get('/api/eventos/:ID', (req, res) => {
    eventos.findOne({ req, res }).then((result) => {
      res.send(result)
    })
  })

  // Add a record
  app.post('/api/eventos', (req, res) => {
    eventos
      .createAsPromise({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(e.code || 500).send(e)
      })
  })

  // Update a record
  app.put('/api/eventos/:ID', (req, res) => {
    eventos
      .update({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })

  // Delete a record
  app.delete('/api/eventos/:ID', (req, res) => {
    eventos
      .delete({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })
}
