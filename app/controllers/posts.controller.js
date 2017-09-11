const router = require('express').Router();
require('../../app/models')();

const { db } = global;
module.exports = (app) => {
  app.use('/api/posts', router);

  router.route('/hot')
    .get((req, res) => {
      res.json({ records: [] });
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
