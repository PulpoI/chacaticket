module.exports = (app) => {
  const tickets = require('../controllers/tickets.controller.js')

  // Get all records
  app.get('/api/tickets', (req, res) => {
    tickets.findAll({ req, res })
  })

  // Search records
  app.get('/api/tickets/search', (req, res) => {
    tickets.find({ req, res }).then((result) => {
      res.send(result)
    })
  })

  // Retrieve a single record
  app.get('/api/tickets/:ID', (req, res) => {
    tickets.findOne({ req, res }).then((result) => {
      res.send(result)
    })
  })

  // Add a record
  app.post('/api/tickets', (req, res) => {
    tickets
      .createAsPromise({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(e.code || 500).send(e)
      })
  })

  // Update a record
  app.put('/api/tickets/:ID', (req, res) => {
    tickets
      .update({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })

  // Delete a record
  app.delete('/api/tickets/:ID', (req, res) => {
    tickets
      .delete({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })
}
