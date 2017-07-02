const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((req, user, done) => {
  done(null, user.id);
});

passport.deserializeUser((req, id, done) => {
  const db = req.db;
  db.user.findById(id, { raw: true, attributes: { exclude: 'password' } })
  .then(user => done(null, user))
  .catch(error => done(error));
});

passport.use(new LocalStrategy({
  usernameField: 'name',
  passwordField: 'password',
  passReqToCallback: true },
  (req, username, password, done) => {
    req.db.user.findOne({ where: { name: username } }).then((user) => {
      if (!user) {
        return done(null, false, { msg: 'Invalid user or password.' });
      }

      user.verifyPassword(password)
      .then((result) => {
        if (!result) {
          return done(null, false, { msg: 'Invalid user or password.' });
        }
      })
      .then(() => done(null, user));
    }).catch(done);
  }
));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect(`${req.baseUrl}/login`);
};

// exports.authenticate = authenticate;

exports.passport = passport;
