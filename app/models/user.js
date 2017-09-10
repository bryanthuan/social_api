
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
      username: DataTypes.STRING
    }, {
      underscored: true,
      tableName: 'users',
      classMethods: {
        associate: function (models) {
          models.User.hasMany(models.Post);
          // models.User.hasMany(models.Like);
        }
      }
    }
  );

  return User;
}
