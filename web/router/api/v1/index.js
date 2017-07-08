const router = require('express').Router();
const user = require('./user');

router.options('/*', (req, res) => {
  res.status(200).end();
});

router.get('/', (req, res) => {
  res.send('It works!');
});

router.use('/user', user);

module.exports = router;
