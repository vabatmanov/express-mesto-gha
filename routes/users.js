const router = require('express').Router();
const {
  getUsers, getUserId, updateUserProfile, updateUserAvatar, getUserInfo,
} = require('../controllers/users');
const { userIdValidation, updateProfileValidation, updateAvatarValidation } = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', userIdValidation, getUserId);
router.patch('/me', updateProfileValidation, updateUserProfile);
router.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);

module.exports = router;
