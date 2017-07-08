const errors = require('../../../../../libs/errors');

module.exports = (req, res, next) => {
  const db = req.db;
  const id = req.user;
  const attributes = ['id', 'name', 'email', 'phone', 'firstName', 'lastName'];

  req.checkBody({
    name: { notEmpty: true },
    phone: { notEmpty: true },
    firstName: { notEmpty: true },
    lastName: { notEmpty: true },
  });

  req.getValidationResult()
  .then((errs) => {
    if (!errs.isEmpty()) {
      throw new errors.BadRequest(errs.array());
    }

    return db.user.findById(id);
  })
  .then((user) => {
    if (!user) {
      throw new errors.NotFound('User not found');
    }
    return user.update(req.body, { fields: ['name', 'phone', 'firstName', 'lastName'] });
  })
  .then(user => db.user.findById(user.id, { attributes }))
  .then(user => res.json(user))
  .catch(next);
};
