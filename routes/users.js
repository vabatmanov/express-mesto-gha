const router = require('express').Router();
const {
  getUsers, getUserId, updateUserProfile, updateUserAvatar, getUserInfo
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', getUserId);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
