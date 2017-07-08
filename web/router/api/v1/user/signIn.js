const errors = require('../../../../../libs/errors');
const auth = require('../../../../auth/passportBearer');

module.exports = (req, res, next) => {
  const db = req.db;

  req.checkBody({
    email: { notEmpty: true },
    password: { notEmpty: true }
  });

  req.getValidationResult()
  .then((errs) => {
    if (!errs.isEmpty()) {
      throw new errors.BadRequest(errs.array());
    }

    return db.user.findOne({ where: { email: req.body.email } });
  })
  .then((user) => {
    if (!user) {
      throw new errors.Unauthorized();
    }

    if (!user.verifyPassword(req.body.password)) {
      throw new errors.Unauthorized();
    }

    return Promise.all([
      auth.createToken(user.id, 'user', 'all'),
      user.update({ lastLoginDate: new Date() })
    ]);
  })
  .then(([token]) => res.json(token))
  .catch(err => next(err));
};
