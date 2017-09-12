
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
  }, {
    underscored: true,
    tableName: 'users',
    classMethods: {
      associate(models) {
        models.User.hasMany(models.Post);
        models.User.hasMany(models.Like);
      },
    },
  });

  return User;
};
