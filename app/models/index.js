
module.exports = function () {
  var env = process.env.NODE_ENV || 'development'

  var glob = require('glob')  
  var config = require('../../config/config')[env]
  var Sequelize = require('sequelize')
  var sequelize = new Sequelize(config.database, config.username, config.password, config)
  var db = {}

  var modelFiles = glob.sync(__dirname + '/*.js', {ignore: __dirname + '/index.js'})
  modelFiles.forEach(function (file) {
    var model = sequelize['import'](file)
    db[model.name] = model
  })

  Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  db.sequelize = sequelize
  db.Sequelize = Sequelize

  global.db = db
}