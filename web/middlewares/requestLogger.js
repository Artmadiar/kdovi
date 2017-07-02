const onFinished = require('on-finished');

/*
  Middlewere handeling request loging to db
*/

module.exports = (req, res, next) => {
  const db = req.db;
  const log = req.body;

  onFinished(res, () => {
    log.systemStatusCode = res.statusCode;
    log.systemCreationDate = new Date();

    db.admin_api_log.create(log);
  });

  next();
};
