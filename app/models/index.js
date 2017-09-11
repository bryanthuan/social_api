module.exports = () => {
  const env = process.env.NODE_ENV || 'development';

  const glob = require('glob');
  const config = require('../../config/config')[env];
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize(config.database, config.username, config.password, config);
  const db = {};

  const modelFiles = glob.sync(`${__dirname}/*.js`, { ignore: `${__dirname}/index.js` });
  modelFiles.forEach((file) => {
    const model = sequelize.import(file);
    db[model.name] = model;
  });

  Object
    .keys(db)
    .forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  global.db = db;
};
