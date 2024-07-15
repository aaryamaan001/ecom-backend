const express = require("express");
const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');// user authorise h ki nhi btata h
const auth = require("../middlewares/auth");
//route bna rhee h ->we can use the app and listen from index file
//baar baar initialize krne ka need nhi padega 
//initialize nhi krenge nhi to listen krna padega

const authRouter = express.Router();//no function only address store hoga
//now we can use authRouter instead of app

// authRouter.get('/user',(req,res)=>{
//         res.json({msg:"babu"});
// });

//SIGN UP ROUTE
//sign up ke  liye ->get data from the client->post in DB->return that data to the user
//admin for the admin api for user
authRouter.post("/api/signup",async (req,res)=>{
    //req.body will have all the data in map form ->get data from user
    try{
        const {name,email,password} = req.body;//name email wagera key of map  h
    
                        //async func
        const existingUser = await User.findOne({email});//mongoose ka prop h
        if(existingUser){
            //not null bs check krega
            return res.status(400).json({msg: "User with same email exist!"});//by default 200 bhejta->continue neeche wale code execute ho jaate->nhi krna h execute
        }
        
        const hashedPassword = await bcryptjs.hash(password,8);//8 is a salt value string->jo password me jud ke kuch aur hi bnayega length nhi h ye
    //let->scope ka kuch diff  h var aur let
        let user = new User({
            //user will have data->whatever mongodb gave us after saving that
            email,
            password:hashedPassword,
            name,
        });

        user = await user.save();//mongodb save krega na
        // _version->how many time we edit a doc _ id

        res.json(user);//({user: user})//by default status code 200
        //1 when ever we signup what validations we can perform
        //firebase khud se kr deta tha weak password ,same account with email password 
        //yha khud se krna h
        //model bna ke validate krenge
    }catch(e){
        res.status(500).json({error: e.message });
        //validation issue ke liye msg n server error ke liye error
    }
    
    //post the data in DB->make connection with DB->inport monggose->make conncetion->url daalo
    //BATABASE me cluseter 0
});


// sign in route
//
authRouter.post('/api/signin', async (req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        //Guard claused negation pehle use kr rha readable
        if(!user){
            res.status(400).json({msg:"User with this email does not exist"});
        }

        const isMatch = bcryptjs.compare(password,user.password);//pass ko hash me rakh ke phirse compare krte->ye kaam nhi krta coz of salt ek string add kr deta to hash alag aata
        if(!isMatch){
            res.status(400).json({msg:"Incorrect password"});
        }

        const token = jwt.sign({id:user._id},"passwordKey");//key->will you to varify our request->user are who they say they are
        //ye hacker se bachayega to saare req me as a header jwt bhejhenge
        //res json send krta h data n user bhi bhejenge 

        res.json({token, ...user._doc});// {token ,user }->nhi hoga pass user ko acces krne ke liye...obj destructring._doc->user prop 'name':ajdfk 'email':lkfj specific pro dega vo name separately email sep 'token':tokensomething ho jaayega user kke part me hi
                            // user ko terminal me lock krenge to bda sa obj aayega of  no use to usko bachane ke liye ._doc use krenge
    }catch(e){
        res.status(500).json({error: e.message });
    }
});


// token ko validate krne ke liye api bnaa rhe h
authRouter.post("/tokenIsValid", async (req,res)=>{
    try{
        const token = req.header('x-auth-token');//token header se aayega
        
        if(!token) return res.json(false);// ye kuch khatarnak h koi obj return nhi kiye bs false return kiye->token valid h ki nhi true false me hi hoga na

        //jwt se varigy kro using the private key we have set in sign in
        const verified = jwt.verify(token,"passwordKey");
        if(!verified) return res.json(false);
        //varified ho gya h to ab dekho ko user varified h ki nhi-> ho skta h token dhoke se shi ho gya ho
        const user = await User.findById(verified.id);//sign in krte time id pass kiye the password key ke saath
        
        if(!user) return res.json(false);

        res.json(true);

    }catch(e){
        res.status(500).json({error: e.message});
    }
});



// get user data -> ye auth is the middleware we will create to make sure we are authorized
 authRouter.get("/", auth, async(req,res)=>{
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
    //ab user ka data mil jaayega
 });

//index.josn file nhi jaanta iska
module.exports = authRouter;//can be used anywhere in application(multiple export{obj bnana padta ya map})