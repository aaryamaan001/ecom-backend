
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const admin = async (req,res,next) =>{
    try{
        const token = req.header("x-auth-token");// har time jab bhi authentication ke liye jaayenge header me pass krna padega
        
        if(!token)
        return res.status(401).json({msg: "No auth token, access denied "});// user token hi nhi diya h

        const verified = jwt.verify(token,"passwordKey");
        if(!verified) return res.status(401).json({msg: "Token verification failed, authorization denied. "});

        //user admin h ki nhi ye bhi chek krna h
        const user = await User.findById(verified.id);//user ko import krna padega
        if(user.type == 'user' || user.type == 'seller'){
            return res.status(401).json({msg: "You are not an admin! "});
        }

        //agar sb thik rha to
        req.user = verified.id;
        req.token = token;
        next();
    }catch(e){
        res.status(500).json({error: e.message});
    }
};

module.exports = admin;