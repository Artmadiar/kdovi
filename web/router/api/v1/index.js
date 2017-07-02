const router = require('express').Router();
// const image = require('./image');

router.options('/*', (req, res) => {
  res.status(200).end();
});

router.get('/', (req, res) => {
  res.send('It works!');
});

router.get('/users', (req, res, next) => {
  req.db.user.findAll()
  .then((users) => {
    res.json(users);
  })
  .catch(err => next(err));
});

// router.use('/image', image);

module.exports = router;
