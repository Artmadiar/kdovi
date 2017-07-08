const errors = require('../../../../../libs/errors');

module.exports = (req, res, next) => {
  const db = req.db;
  const id = req.user;
  const attributes = ['id', 'name', 'email', 'phone', 'firstName', 'lastName'];

  const where = {};

  if (!id) where.id = id;

  db.user.findById(id, { raw: true, attributes })
  // db.user.findAll({ raw: true, attributes })
  .then((results) => {
    if (id && !results) {
      throw new errors.NotFound('User not found');
    }
    res.send(results);
  })
  .catch(next);
};
