const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {

    //Check for errors
    const isError = validationResult(req);
    if(!isError.isEmpty()){
        return res.status(400).json({error: isError.array()})
    }

    //Deconstruct mail and password
    const { email, password } = req.body
    try {
       let user = await User.findOne({ email });

       if(user){
           return res.status(400).json({ msg: 'User already exist'})
       }
       
       //create new user
       user = new User(req.body);

       //Hash password
       const salt = await bcryptjs.genSalt(10);
       user.password = await bcryptjs.hash(password, salt);

       //saving user
        await user.save();

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
    } catch (err) {
        console.log(err);
        res.status(400).send("There's a mistake")
    }
}