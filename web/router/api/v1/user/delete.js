const errors = require('../../../../../libs/errors');

module.exports = (req, res, next) => {
  const db = req.db;
  const id = req.params.id;

  db.user.findById(id)
  .then((user) => {
    if (!user) {
      throw new errors.NotFound('User not found');
    }
    return user.destroy();
  })
  .then(() => res.sendStatus(204))
  .catch(next);
};
