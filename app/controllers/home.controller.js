const router = require('express').Router();

module.exports = function (app) {
  app.use('/api', router);

  router.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });
  });
};
