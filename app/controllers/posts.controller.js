var router = require('express').Router();

module.exports = function (app) {
  app.use('/api/posts', router);

  router.route('/hot')
    .get(function (req, res) {
      res.json({records: []});
    });

  router.route('/recent')
    .get(function (req, res) {
      res.json({records: []});
    });
}

