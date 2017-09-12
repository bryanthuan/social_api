require('../../app/models')();

const { db } = global;
const request = require('request');
const Q = require('q');
const utils = require('../utils');

const BASE_URL = 'http://localhost:3000/api';

function dbCleanup() {
  return Q.all([
    db
      .User
      .destroy({ where: {} }),
    db
      .Post
      .destroy({ where: {} }),
    db
      .Like
      .destroy({ where: {} }),
  ]);
}

describe('GET /api/posts/*', () => {
  let user;
  const now = new Date();
  let [post1, post2, post3] = [];
  const post1CreatedAt = utils.minutesAgo(now, 120);
  const post2CreatedAt = utils.minutesAgo(now, 90);
  const post3CreatedAt = utils.minutesAgo(now, 180);

  beforeEach(async (done) => {
    await dbCleanup();
    user = await db.User.create({ username: 'updawg' });
    await db
      .Post
      .bulkCreate([
        {
          content: 'P1',
          user_id: user.id,
          created_at: post1CreatedAt,
        }, {
          content: 'P2',
          user_id: user.id,
          created_at: post2CreatedAt,
        }, {
          content: 'P3',
          user_id: user.id,
          created_at: post3CreatedAt,
        },
      ]);
    const posts = await db.Post.findAll({});
    [post1, post2, post3] = posts;
    done();
  });

  describe('/api/posts/recent', () => {
    const endpoint = `${BASE_URL}/posts/recent`;

    it('returns records in recency order', (done) => {
      request.get(endpoint, (error, response, body) => {
        const json = JSON.parse(body);
        const records = json
          .records
          .map(r => r.id);
        expect(records).toEqual([post2.id, post1.id, post3.id]);
        done();
      });
    });

    it('returns correct payload', (done) => {
      request.get(endpoint, (error, response, body) => {
        const json = JSON.parse(body);
        expect(json.records[0]).toEqual({
          id: post2.id,
          content: post2.content,
          username: user.username,
        });
        done();
      });
    });
  });

  describe('/api/posts/hot', () => {
    const endpoint = `${BASE_URL}/posts/hot`;

    beforeEach((done) => {
      db
        .Like
        .bulkCreate([
          {
            post_id: post1.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post1CreatedAt, 59),
          }, {
            post_id: post1.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post1CreatedAt, 59),
          }, {
            post_id: post1.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post1CreatedAt, 59),
          }, {
            post_id: post1.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post1CreatedAt, 59),
          }, {
            post_id: post1.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post1CreatedAt, 59),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2CreatedAt, 10),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2CreatedAt, 10),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2CreatedAt, 10),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2CreatedAt, 10),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2CreatedAt, 61),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3CreatedAt, 50),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3CreatedAt, 50),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3CreatedAt, 55),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3CreatedAt, 55),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3CreatedAt, 55),
          },
        ])
        .then(() => {
          done();
        });
    });

    it('returns records in recency order', (done) => {
      request.get(endpoint, (error, response, body) => {
        const json = JSON.parse(body);
        const records = json
          .records
          .map(r => r.id);
        expect(records).toEqual([post1.id, post3.id]);
        done();
      });
    });

    it('returns correct payload', (done) => {
      request.get(endpoint, (error, response, body) => {
        const json = JSON.parse(body);
        expect(json.records[0]).toEqual({
          id: post1.id,
          content: post1.content,
          username: user.username,
        });
        done();
      });
    });
  });
});
