//waise hi admin ke liye bhi bnaye honge

const jwt = require('jsonwebtoken');

//function bnayenge next==continue(next route)
const auth = async (req,res,next)=>{
    try{
        const token = req.header('x-auth-token');// har time jab bhi authentication ke liye jaayenge header me pass krna padega
        
        if(!token)
        return res.status(401).json({msg: "No auth token, access denied "});// user token hi nhi diya h

        const verified = jwt.verify(token,"passwordKey");
        if(!verified) return res.status(401).json({msg: "Token verification failed, authorization denied. "});

        //vimp->we are adding new obj to req and adding new user to it
        req.user = verified.id;
        req.token = token;
        //har baar body me user id  pass nhi kr skte
        // isi karan auth middleware add kr rhe h taaki
        //validation perform kr paaye sb && req.user ke andar id store kr de agar vaid hoga
        //req.user krne se aa jaayega msg user ka id

        //('',auth,()=>{   ye function nhi run hoga auth bs run hoga agr next nhi kiye to})
        next();// it can call the next callback function
    }catch(e){
        res.status(500).json({error: e.message});
    }
}

//ye auth chlega nhi coz export nhi hua h
module.exports = auth;