const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const bluebird = require('bluebird');
const uuidV4 = require('uuid/v4');
const redis = require('redis');

// Promises are beeing added
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

function authenticateWithToken(token, done) {
  redisClient.hgetallAsync(token)
  .then((session) => {
    if (!session) return done(null, false);

    return redisClient.expireAsync(token, process.env.BEARER_EXPIRESIN)
      .then(() => done(null, session.id, { scope: session.scope }));
  })
  .catch(done);
}

function createToken(id, role, scope) {
  const token = uuidV4();

  return Promise.all([
    redisClient.hsetAsync(token, 'id', id),
    redisClient.hsetAsync(token, 'role', role),
    redisClient.hsetAsync(token, 'scope', scope),
    redisClient.expireAsync(token, process.env.BEARER_EXPIRESIN)
  ])
  .then(() => ({
    tokenType: 'Bearer',
    accessToken: token,
    expires: new Date(Date.now() + parseInt(process.env.BEARER_EXPIRESIN, 10))
  }));
}

passport.use(new BearerStrategy(authenticateWithToken));

passport.bearer = passport.authenticate('bearer', { session: false });

module.exports = {
  passport,
  createToken
};
