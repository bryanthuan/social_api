const router = require('express').Router();
require('../../app/models')();

const { db } = global;
module.exports = (app) => {
  app.use('/api/posts', router);

  router.route('/hot')
    .get(async (req, res) => {
      const posts = await db.sequelize.query(`
      SELECT
      posts."id",
      posts."content",
      username
    FROM
      posts
      JOIN users ON users.ID = posts.user_id
      
      JOIN likes ON likes.post_id = posts."id"
      
      WHERE DATE_PART( 'hour', likes.created_at - posts.created_at ) < 1 
      
      GROUP BY posts."id", posts."content", username , posts.created_at
      
      HAVING COUNT ( likes.ID ) >= 5
      ORDER BY posts.created_at DESC
      `, { model: db.Post });
      res.json({ records: [...posts] });
    });

  router.route('/recent')
    .get(async (req, res) => {
      const posts = await db.Post.findAll({
        include: [{
          model: db.User,
          attributes: ['username'],
        }],
        order: [
          ['created_at', 'DESC'],
        ],
      }).map(({ id, content, User }) => ({
        id, content, username: User.username,
      }));

      res.json({ records: [...posts] });
    });
};
