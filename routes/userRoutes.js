const router = require('express').Router();
const {editUser, getAllUsers, getUserDetails } = require('../controllers/userController');
const isAuthorized = require('../middlewares/authorization');

router.patch('/edit/:userId', editUser);
router.get('/allUsers', isAuthorized, getAllUsers);
router.get('/:userId', getUserDetails);


module.exports = router;