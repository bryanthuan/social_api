require('../../app/models')();

var db      = global.db;
var request = require('request');
var Q       = require('q');
var utils   = require('../utils');

var BASE_URL = 'http://localhost:3000/api';

function dbCleanup () {
  return Q.all([
    db.User.destroy({where: {}}),
    db.Post.destroy({where: {}})
  ]);
}

describe('GET /api/posts/*', function () {
  var now;
  var user;
  var post1, post2, post3;
  var post1_created_at, post2_created_at, post3_created_at;
  var endpoint = BASE_URL + '/posts/recent';

  now = new Date();

  post1_created_at = utils.minutesAgo(now, 120);
  post2_created_at = utils.minutesAgo(now, 90);
  post3_created_at = utils.minutesAgo(now, 180);

  beforeEach(function (done) {
    dbCleanup()
    .then(function () {
      db.User.create({username: 'updawg'}).then(function (u) {
        user = u
        return db.Post.bulkCreate([
          {content: 'P1', user_id: user.id, created_at: post1_created_at},
          {content: 'P2', user_id: user.id, created_at: post2_created_at},
          {content: 'P3', user_id: user.id, created_at: post3_created_at}
        ]).then(function () {
          return db.Post.findAll({}).then(function (posts) {
            post1 = posts[0];
            post2 = posts[1];
            post3 = posts[2];

            done();
          });
        });
      });
    });
  });

  describe('/api/posts/recent', function() {
    it('returns records in recency order', function (done) {
      request.get(endpoint, function (error, response, body) {
        var json = JSON.parse(body);
        var records = json.records.map(function (r) {
          return r.id;
        });
        expect(records).toEqual([post2.id, post1.id, post3.id]);
        done();
      })
    })

    it('returns correct payload', function (done) {
      request.get(endpoint, function (error, response, body) {
        json = JSON.parse(body)
        expect(json.records[0]).toEqual({
          id: post2.id,
          content: post2.content,
          username: user.username
        })
        done()
      })
    })
  })

  describe('/api/posts/hot', function() {
    var endpoint = BASE_URL + '/posts/hot'

    beforeEach(function(done) {
      db.Like.bulkCreate([
        {post_id: post1.id, user_id: user.id, created_at: utils.minutesAdd(post1_created_at, 59)},
        {post_id: post1.id, user_id: user.id, created_at: utils.minutesAdd(post1_created_at, 59)},
        {post_id: post1.id, user_id: user.id, created_at: utils.minutesAdd(post1_created_at, 59)},
        {post_id: post1.id, user_id: user.id, created_at: utils.minutesAdd(post1_created_at, 59)},
        {post_id: post1.id, user_id: user.id, created_at: utils.minutesAdd(post1_created_at, 59)},

        {post_id: post2.id, user_id: user.id, created_at: utils.minutesAdd(post2_created_at, 10)},
        {post_id: post2.id, user_id: user.id, created_at: utils.minutesAdd(post2_created_at, 10)},
        {post_id: post2.id, user_id: user.id, created_at: utils.minutesAdd(post2_created_at, 10)},
        {post_id: post2.id, user_id: user.id, created_at: utils.minutesAdd(post2_created_at, 10)},
        {post_id: post2.id, user_id: user.id, created_at: utils.minutesAdd(post2_created_at, 61)},

        {post_id: post3.id, user_id: user.id, created_at: utils.minutesAdd(post3_created_at, 50)},
        {post_id: post3.id, user_id: user.id, created_at: utils.minutesAdd(post3_created_at, 50)},
        {post_id: post3.id, user_id: user.id, created_at: utils.minutesAdd(post3_created_at, 55)},
        {post_id: post3.id, user_id: user.id, created_at: utils.minutesAdd(post3_created_at, 55)},
        {post_id: post3.id, user_id: user.id, created_at: utils.minutesAdd(post3_created_at, 55)}
      ]).then(function() {
        done()
      })
    })

    it('returns records in recency order', function(done) {
      request.get(endpoint, function (error, response, body) {
        var json = JSON.parse(body)
        var records = json.records.map(function (r) {
          return r.id
        })
        expect(records).toEqual([post1.id, post3.id])
        done()
      })
    })

    it('returns correct payload', function(done) {
      request.get(endpoint, function (error, response, body) {
        json = JSON.parse(body)

        expect(json.records[0]).toEqual({
          id: post1.id,
          content: post1.content,
          username: user.username
        })
        done()
      })
    })

  })
})
