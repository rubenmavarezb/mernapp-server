const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //Reading token from header
    const token = req.header('x-auth-token');
    
    //check if there's no token
    if(!token){
        return res.status(401).json({msg: 'There is no token, invalid permission'})
    }

    //Validate token
    try {
        const encode = jwt.verify(token, process.env.SECRET);
        req.user = encode.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Invalid token'})
    }
}