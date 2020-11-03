const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req,res) => {
    //Check for errors
    const isError = validationResult(req);
    if(!isError.isEmpty()){
        return res.status(400).json({error: error.array()})
    }

    const { email, password } = req.body;

    try {
        //Check if the user has already signed up
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({msg: "The user doesn't exist"})
        }

        //Check password
        const correctPassword = await bcryptjs.compare(password, user.password);
        if(!correctPassword){
            return res.status(400).json({msg: 'Invalid password'})
        }

        //Creating and signing JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 // 1 hour
        }, (err, token) => {
            if(err) throw err;

            //Confirmation msg
            res.json({ token })
        })
    } catch (error) {
        console.log(error);
    }
}

exports.authenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user })
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'There was a mistake'})
    }
}