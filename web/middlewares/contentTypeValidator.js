const errors = require('../../libs/errors');

/**
 * Content type validation
 */
module.exports = (options) => {
  const validTypes = options.types || ['application/json', 'application/x-www-form-urlencoded'];

  return (req, res, next) => {
    if (req.method !== 'POST') {
      return next();
    }

    const contentType = req.headers['content-type'];
    let isValid = false;

    if (contentType) {
      for (let i = 0; i < validTypes.length; i++) {
        if (contentType.indexOf(validTypes[i]) !== -1) {
          isValid = true;
          break;
        }
      }
    }

    if (!isValid) {
      throw new errors.ContentType();
    }

    next();
  };
};
