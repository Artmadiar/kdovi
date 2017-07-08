const errors = require('../../../../../libs/errors');
const auth = require('../../../../auth/passportBearer');

module.exports = (req, res, next) => {
  const db = req.db;

  req.checkBody({
    name: { notEmpty: true },
    email: { notEmpty: true },
    phone: { notEmpty: true },
    firstName: { notEmpty: true },
    lastName: { notEmpty: true },
    password: {
      notEmpty: true,
      isLength: { options: [{ min: 6 }] }
    }
  });

  req.getValidationResult()
  .then((errs) => {
    if (!errs.isEmpty()) {
      throw new errors.BadRequest(errs.array());
    }

    return db.user.findOne({ where: { email: req.body.email } });
  })
  .then((user) => {
    if (user) {
      throw new errors.AlreadySignedUp();
    }
    req.body.lastLoginDate = new Date();
    return db.user.create(req.body);
  })
  .then(user => auth.createToken(user.id, 'user', 'all'))
  .then(token => res.json(token))
  .catch(err => next(err));
};
