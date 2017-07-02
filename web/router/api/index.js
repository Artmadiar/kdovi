const router = require('express').Router();
const v1 = require('./v1');
const accessControl = require('../../middlewares/accessControl');

router.use(accessControl);

router.options('/*', (req, res) => {
  res.status(200).end();
});

router.use('/v1', v1);

module.exports = router;
