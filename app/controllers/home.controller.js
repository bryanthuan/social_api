var router = require('express').Router()

module.exports = function (app) {
  app.use('/api', router)

  router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' })
  })

}