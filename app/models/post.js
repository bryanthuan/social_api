
module.exports = function (sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
      content: DataTypes.STRING,
      user_id: DataTypes.INTEGER
    }, {
      underscored: true,
      tableName: 'posts',
      classMethods: {
        associate: function (models) {
          models.Post.belongsTo(models.User, {foreignKey: 'user_id'});
          // models.Post.hasMany(models.Like);
        }
      }
    }
  );

  return Post;
}
