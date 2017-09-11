require('../../app/models')();

const db = global.db;
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
  ]);
}

describe('GET /api/posts/*', () => {
  let now;
  let user;
  let post1,
    post2,
    post3;
  let post1_created_at,
    post2_created_at,
    post3_created_at;
  const endpoint = `${BASE_URL}/posts/recent`;

  now = new Date();

  post1_created_at = utils.minutesAgo(now, 120);
  post2_created_at = utils.minutesAgo(now, 90);
  post3_created_at = utils.minutesAgo(now, 180);

  beforeEach((done) => {
    dbCleanup().then(() => {
      db
        .User
        .create({ username: 'updawg' })
        .then((u) => {
          user = u;
          return db
            .Post
            .bulkCreate([
              {
                content: 'P1',
                user_id: user.id,
                created_at: post1_created_at,
              }, {
                content: 'P2',
                user_id: user.id,
                created_at: post2_created_at,
              }, {
                content: 'P3',
                user_id: user.id,
                created_at: post3_created_at,
              },
            ])
            .then(() => db.Post.findAll({}).then((posts) => {
              post1 = posts[0];
              post2 = posts[1];
              post3 = posts[2];

              done();
            }));
        });
    });
  });

  describe('/api/posts/recent', () => {
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
        json = JSON.parse(body);
        expect(json.records[0]).toEqual({ id: post2.id, content: post2.content, username: user.username });
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
            created_at: utils.minutesAdd(post1_created_at, 59),
          }, {
            post_id: post1.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post1_created_at, 59),
          }, {
            post_id: post1.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post1_created_at, 59),
          }, {
            post_id: post1.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post1_created_at, 59),
          }, {
            post_id: post1.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post1_created_at, 59),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2_created_at, 10),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2_created_at, 10),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2_created_at, 10),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2_created_at, 10),
          }, {
            post_id: post2.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post2_created_at, 61),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3_created_at, 50),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3_created_at, 50),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3_created_at, 55),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3_created_at, 55),
          }, {
            post_id: post3.id,
            user_id: user.id,
            created_at: utils.minutesAdd(post3_created_at, 55),
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
        json = JSON.parse(body);

        expect(json.records[0]).toEqual({ id: post1.id, content: post1.content, username: user.username });
        done();
      });
    });
  });
});
