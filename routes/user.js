const express = require('express');
const auth = require('../middlewares/auth');
const { Product } = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const userRouter = express.Router();


userRouter.post('/api/add-to-cart',auth,async(req,res,)=>{
    try{
       const{id} = req.body;
       const product = await Product.findById(id);
       //user bhi search krna h coz user ->we need to store data in user alg se store nhi krenge coz we weill not search everytime we click cart button coz user already logged in h
       //usermodel me store kr rhe
       let user = await User.findById(req.user);//req.user se user id milega
        
       if(user.cart.length==0){
        user.cart.push({product,quantity:1});//1st time agr dalega to yhi hoga quantity 1
       }else{
            let isProductFound = false;
            //vimp
            for(let i = 0;i<user.cart.length;i++){
                //looping through all product 
                //product already h to count incresae kroo nhi to pehle jaise
                                    //ye id obj h to string me convert kiye product._id->obj h to  usko product._id se kro coz obj h // string id h usko krte compare to cart.product._id.toString krna padta
                if (user.cart[i].product._id.equals(product._id)) {
                    isProductFound = true;
                }   
                    //_id hi mongoose deta h->obj id hi rehta h mongo dp me == nhi use kr rhee h isliye bhi mongood id compare kr rhe equals
            }

            //product found mila->increment otherwise add the new product 
            if(isProductFound){// array me search krne ke liye         //user ka product property in users cart
                let producttt = user.cart.find((productt) =>
                    productt.product._id.equals(product._id)
                  );
                  producttt.quantity += 1;
            }else{
                user.cart.push({product,quantity:1});//1st time agr dalega to yhi hoga quantity 1    
            }
        }
        user = await user.save();//
        res.json(user);// update provider in the client side
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});



userRouter.delete('/api/remove-from-cart/:id',auth,async(req,res,)=>{
    try{
       const{id} = req.params;//.id bhi likh skte
       const product = await Product.findById(id);
       //user bhi search krna h coz user ->we need to store data in user alg se store nhi krenge coz we weill not search everytime we click cart button coz user already logged in h
       //usermodel me store kr rhe
       let user = await User.findById(req.user)//req.user se user id milega
        
        //vimp
            for(let i = 0;i<user.cart.length;i++){
                //looping through all product 
                //product already h to count incresae kroo nhi to pehle jaise
                                    //ye id obj h to string me convert kiye product._id->obj h to  usko product._id se kro coz obj h // string id h usko krte compare to cart.product._id.toString krna padta
                if(user.cart[i].product._id.equals(product._id)){//_id hi mongoose deta h->obj id hi rehta h mongo dp me == nhi use kr rhee h isliye bhi mongood id compare kr rhe equals
                    if(user.cart[i].quantity == 1){
                        // 0 hoga
                        user.cart.splice(i,1);
                    }else{
                        user.cart[i].quantity -= 1;//user.cart[i].product.quantty ->no. of total product left btayega na ki cart wala sense nhi banta phir
                    }
                    //remove krne ke liye
                    //agar quantity 1 hua to 0 hoga vo nhi chahiye
                }
            }

            user = await user.save();//
            res.json(user);// update provider in the client side
       
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});



userRouter.post('/api/save-user-address',auth, async (req,res)=> {

    try{
        const {address} = req.body;
        let user = await User.findById(req.user);

        user.address = address;
        user = await user.save();
        res.json(user);
    
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});


//Order a product
userRouter.post('/api/order',auth, async (req,res)=> {

    try{
        const {cart,totalPrice,address} = req.body;
        //cart will be in json format->we cannot give model to the server
        let products = [];

        for(let i = 0;i<cart.length;i++){
            let product = await Product.findById(cart[i].product._id);//to get each product
            //quantity hamare paas jyada h ki kam h
            if(product.quantity >= cart[i].quantity){
                product.quantity -= cart[i].quantity;
                products.push({product,quantity: cart[i].quantity});
                await product.save();
            }else{
                return res.status(400).json({msg: `${product.name} is out of stock!`}); //back `it is userd for string interpolation`
            }
        }

        let user = await User.findById(req.user);
        user.cart = [];
        user = await user.save();

        //create the order
        let order = new Order({
            products,
            totalPrice,
            address,
            userId: req.user,
            orderedAt: new Date().getTime(),//get milllisec
        });

        
        order = await order.save();
        res.json(order);
    
    }catch(e){
        return res.status(500).json({error: e.message});

    }
});



//display all the order of the user
userRouter.get('/api/orders/me',auth,async (req,res)=>{
    try{
        const orders = await Order.find({userId:req.user});
        res.json(orders);
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});



module.exports = userRouter;