const express = require('express');
const router = express.Router();
const {registerUser, loginUser, editUser, getAllUsers, getUserDetails } = require('../controllers/authControllers');
const passport = require('../controllers/passportConfig');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/failure' }),
    (req, res) => {
      res.redirect(`/?token=${req.user}`);
    }
  );
  router.get('/failure', (req,res)=>{
    return res.send('Authentication Failed');
  })



module.exports = router;