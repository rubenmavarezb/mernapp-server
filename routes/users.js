//Routes for creating users
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator')

//Creating an user
//api/users
router.post('/', 
    [
        check('name', 'Name is requred').not().isEmpty(),
        check('email', 'Enter a valid mail').isEmail(),
        check('password', 'Password must have a minimum of 6 characters').isLength({ min: 6})
    ],
    userController.createUser
)
module.exports= router;