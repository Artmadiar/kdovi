module.exports = (req, res, next) => {
  /**
   * ?getfields
   * Return list of resource fields
   */
  const db = req.db;
  const excludeFields = ['createdAt', 'updatedAt', 'deletedAt', 'password', 'marketoSource'];

  if (req.query.hasOwnProperty('getfields')) {
    const defaultResources = ['club', 'region', 'trainer'];

    defaultResources.forEach((resource) => {
      if (req.url.indexOf(`/${resource}`) >= 0) {
        const fields = Object.keys(db[resource].rawAttributes)
          .filter(field => excludeFields.indexOf(field) === -1);

        return res.send(fields);
      }
    });

    if (req.url.indexOf('/profile') >= 0) {
      return res.send(['name', 'surname', 'address', 'postalCode', 'city', 'phone', 'mobile', 'email', 'photo',
        'birthDate', 'membershipName', 'language', 'facebook', 'allowNotifications', 'weight', 'height', 'unitSystem']);
    }
    return next();
  }

  /**
   * ?field=id&field=name
   * Select fields to be returned
   */
  if (req.query.field && req.query.hasOwnProperty('field')) {
    const resources = ['club', 'region', 'trainer', 'profile'];
    let resource = null;

    for (let i = 0; i < resources.length; i++) {
      if (req.url.indexOf(`/${resources[i]}` >= 0)) {
        resource = resources[i];
        break;
      }
    }

    if (!resource) {
      return next();
    }

    let fields = null;
    if (req.query.field.constructor === Array) {
      fields = req.query.field;
    } else {
      fields = [req.query.field];
    }

    req.query.field = fields.filter(field => db[resource].attributes[field]);

    return next();
  }

  return next();
};
