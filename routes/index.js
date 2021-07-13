const express = require('express');

const router = express();
const { login, createUsers } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUsers);
router.use(auth);
router.use('/movies', require('./movies'));
router.use('/users', require('./users'));

module.exports = router;
