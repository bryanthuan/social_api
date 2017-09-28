# An complelete rest api and Jasmine testing case with SequelizeJS - PostgreSQL

## Installing
1. You should have `PostgreSQL` installed on your machine
2. Edit database config for `development` environment on `config/config.js`
3. Install dependencies: `npm i`
4. Run database migrations: `NODE_ENV=development node_modules/.bin/sequelize db:migrate`
5. Running server: `npm start`

## Testing
1. For testing, we will create another database for storing test data
2. Remember to edit database config for `test` environment
3. Run database migrations: `NODE_ENV=test node_modules/.bin/sequelize db:migrate`
4. Start test server: `npm run start-test`
5. Run test: `npm test`

If you have another better way, please do it, that will be a good point! :)

## Requirements
__We have 4 existing test cases run by `Jasmine`,
you mission is to edit the code to make these 4 test cases green__

We are using `SequelizeJS` to work with database, you can use another library if you want.

*If you see something is not good and you can make the code better,
feel free to edit and refactor the whole things (structure, code style, testing, best practice, etc).
This is very good point!*

__[1] Rank by recency__
*Test case 1:* Return list of post in recency order
*Test case 2:* Returning payload must have `id, content, username`

__[2] Create likes table and its association to posts__

__[3] Rank by hot: >= 5 likes within the first hour of post creation__
*Test case 3:* Return list of hot post in recency order
*Test case 4:* Returning payload must have `id, content, username`

__[4] Improve performance for hot.__
Let's say we have a lot of records in posts and
alot more in likes, how to improve the performance of the queries.
A good solution should be both fast and info should be up-to-date.
If you need to change the code please do, and remember to write test for it.

