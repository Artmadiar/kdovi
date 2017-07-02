const errors = require('../../../../../libs/errors');

module.exports = (req, res, next) => {
  const db = req.db;
  const regionExternalId = req.query.regionExternalId;
  const languageId = req.query.languageId;
  const url = req.query.url;

  if (!regionExternalId || !languageId || !url) {
    throw new errors.BadRequest();
  }

  db.region.findOne({ where: { externalId: regionExternalId.toUpperCase() } })
  .then((region) => {
    if (!region) {
      throw new errors.NotFound();
    }
    return db.page.findOne({ where: { regionId: region.id, url, languageId }, raw: true });
  })
  .then((page) => {
    if (!page) {
      throw new errors.NotFound();
    }
    res.send(page.content);
  })
  .catch(next);
};
