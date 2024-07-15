const monggose = require('mongoose');//no interaction with anything
const { productSchema } = require('./product');

const userSchema = monggose.Schema({
    //define prop
    name:{
        required:true,
        type :String,//js is Dynaic type ->MONGOOSE ke liye string btaye h js ke liye nhi
        trim:true,
    },

    email:{
        required:true,
        type:String,
        trim:true,
        validate:{
            validator:(val)=>{//same as validator in customtextformfield
                const re =
                            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;//email validator rajx
                return val.match(re)
            },
            message:'Please enter a valid email address'//only if the email will not be same
        }
    },

    password:{
        required:true,
        type:String,
        //validator bna ke password.length> kr skte h
    },
    
    address:{
        type:String,
        default:'',
    },

    type:{
        type:String,
        default:'user'//admin n seller
    },
    // cart ->product + quantity
    cart:[
        {
            product:productSchema,//model nhi paas kr skte
            quantity:{
                type: Number,
                required: true,
            }
        }
    ],
});

//schema h->export nhi kiye h
//user bnana padega->model bnana padega
//class se map dynamic krte the waise hi
const User = monggose.model("User",userSchema);//model name n schema h

module.exports = User;
