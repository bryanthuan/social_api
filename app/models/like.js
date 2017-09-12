
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    post_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    tableName: 'likes',
    classMethods: {
      associate(models) {
        models.Like.belongsTo(models.User, { foreignKey: 'user_id' });
        models.Like.belongsTo(models.Post, { foreignKey: 'post_id' });
      },
    },
  });

  return Like;
};

