const errors = require('../../libs/errors');

module.exports = (req, res, next) => {
  req.checkParams('id').notEmpty().isInt();
  req.getValidationResult()
  .then((errs) => {
    if (!errs.isEmpty()) {
      throw new errors.BadRequest(errs.array());
    }
    return next();
  })
  .catch(next);
};
