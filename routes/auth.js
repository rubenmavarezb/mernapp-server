//Routes for authenticate users
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth')

//log an user
//api/users
router.post('/', 
    authController.authenticateUser
)

router.get('/',
    auth,
    authController.authenticatedUser
)

module.exports= router;