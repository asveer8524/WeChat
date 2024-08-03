const express = require('express');
const router=express.Router();
const {test,registerUser,userProfile,loginUser} = require('../controllers/Register');

//router.get('',test);

router.post('/register',registerUser);

router.post('/login',loginUser);

router.get('/profile',userProfile);

module.exports = router;