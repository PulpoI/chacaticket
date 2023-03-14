module.exports = (app) => {
  const users = require('../controllers/users.controller.js')
  const userService = require('../services/users.service')
  // Get all records
  app.get('/api/users', (req, res) => {
    users.findAll({ req, res })
  })

  // Search records
  app.get('/api/users/search', (req, res) => {
    users.find({ req, res }).then((result) => {
      res.send(result)
    })
  })

  // Retrieve a single record
  app.get('/api/users/:ID', (req, res) => {
    users.findOne({ req, res }).then((result) => {
      res.send(result)
    })
  })

  // Add a record
  app.post('/api/users', (req, res) => {
    users
      .createAsPromise({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(e.code || 500).send(e)
      })
  })

  // Update a record
  app.put('/api/users/:ID', (req, res) => {
    const response = userService.jwtVerify(req.headers.authorization)
    if (response.error) res.status(401).json(response)
    users
      .update({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })

  // Delete a record
  app.delete('/api/users/:ID', (req, res) => {
    users
      .delete({ req, res })
      .then((result) => {
        res.send(result)
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })

  // Send Nonce
  app.post('/api/users/recoverpassword', (req, res) => {
    userService
      .recoverPassword(req)
      .then((user) => {
        res.json('ok')
      })
      .catch((next) => {
        res.statusCode = 401
        res.json(next)
      })
  })

  // Check Nonce
  app.post('/api/users/checknonce', (req, res) => {
    userService
      .checkNonce(req)
      .then((user) => {
        res.json(user)
      })
      .catch((next) => {
        res.statusCode = 500
        res.json(next)
      })
  })

  // Authenticate User
  app.post('/api/users/authenticate', function (req, res) {
    userService
      .authenticate(req.body)
      .then((user) => {
        res.json(user)
      })
      .catch((next) => {
        res.statusCode = 401
        res.json(next)
      })
  })
}
