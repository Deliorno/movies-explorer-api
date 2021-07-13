const router = require('express').Router();
const {
  getUsersMe, patchInfo
} = require('../controllers/users');

router.get('/me', getUsersMe);
router.patch('/me', patchInfo);

module.exports = router;