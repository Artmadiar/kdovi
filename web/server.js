/**
 * Load environment variables
 */
const path = require('path');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.load({ path: path.join(__dirname, '/../.env') });
}


/**
 * Module dependencies
 */
const express = require('express');
const expressValidator = require('express-validator');
const compression = require('compression');
const morgan = require('morgan'); // only HTTP requests
const sass = require('node-sass-middleware');
const router = require('./router');
const errors = require('../libs/errors');

/**
 * Express
 */
const app = express();

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));

const logFormat = morgan.compile('[:date[iso]] :method :url :status :response-time ms - :res[content-length]');
app.use(morgan(logFormat));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Routes
 */
app.use(router);

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.error(err);

  // if (process.env.CLOUD_ERROR_EMAILS !== '' && (!(err instanceof errors.InternalError) || err.code >= 500)) {
  //   const sender = require('../libs/sender.js')();
  //   sender.send(`Error: ${err.name}`, 'Cloud reporting <info@holmesplace.com>', process.env.CLOUD_ERROR_EMAILS, `${err.stack}`)
  //     .then(console.log);
  // }

  // convert bodyparser errors into internal one
  if (err instanceof SyntaxError &&
    err.status >= 400 && err.status < 500 &&
    err.message.indexOf('JSON')) {
    err = new errors.InvalidJson(err.status);
  }

  const unknowError = !(err instanceof errors.InternalError);
  if (unknowError) {
    err = new errors.InternalError();
  }

  err.name = err.constructor.name;
  res.status(err.code).json(err);
});

app.listen(app.get('port'), () => {
  console.log('[RUNNING] PORT: %d MODE: %s TIME: %s', app.get('port'), app.get('env'), Date());
});


/**
 * Logs stream
 */
const server = require('http').Server();
const spawn = require('child_process').spawn;
const io = require('socket.io').listen(server);
const passportSocketIo = require('./middlewares/socketIOAuth');
const passport = require('./auth/passportLocal');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const db = require('../models');

const redisStoreConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  prefix: process.env.REDIS_PREFIX,
  logErrors: true
};

passport.passport.initialize();
passport.passport.session();

io.use((req, next) => {
  req.db = db();
  next();
});

io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: process.env.SESSION_SECRET,
  store: new RedisStore(redisStoreConfig),
  passport: passport.passport,
  cookieParser
}));

io.sockets.on('connection', (socket) => {
  // some code...
});

server.listen(9090);

module.exports = app;
