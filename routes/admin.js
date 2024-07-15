//sare admin ke function

const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin');//kitna bhi middlewarea add kr skte
const { Product } = require("../models/product");//destructure -> product of product schema dono pass hua tha
const Order = require('../models/order');
const { PromiseProvider } = require("mongoose");
//sift admin ko hi allow kr rhe isliye admin middleware bananye
//sbko allow krna hota to auth hi kr lete
//create an admin middleware
//adding product->admin ke liye//admin middle h import krna padega
adminRouter.post('/admin/add-product',admin,async(req,res,)=>{
    try{
        //we have to get something from req .body
        const {name,description,images,quantity,price,category}= req.body;//must match with product.dart file me toMap wale me jo : ke baad likha h na usme 
        //product model bna diye ab
        // let will make us change the variable later on
        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category,
        });
        

        //save to database to mongodb->and ye humko ek _id aur version dega->usko product variable me store kra ke clent to bhej rhe res se client ke paas jaata h
        product = await product.save();
        res.json(product);//return the product to the client side
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});


//get all the product from the db
//client se koi input nhi chahiye bs fetch kr rhe
//middleware lagaye coz sirf admin hi access kr paaye
adminRouter.get('/admin/get-products',admin,async (req,res)=>{
    try{
        const products = await Product.find({});//kuch bhi pass nhi kr rhee h->it will give us the list of item{jo bhi pass kr denge}->ek particular id chahiye hoga->{id:userId}->ya kuch aur bhi
        res.json(products);
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});

//delete the product->post hoga coz we are not going to post the id of product that we want to delete 
adminRouter.post("/admin/delete-product",admin,async (req,res)=>{
    try{
        const {id} = req.body;
        let product = await Product.findByIdAndDelete(id);
        //product = await product.save();//to save updated list in db yhi smjh nhi aaya->deleted product ko save krn
        res.json(product);//deleted product ko send and save kr rhe h 
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});


//GET THE ORDER
adminRouter.get('/admin/get-orders',admin,async (req,res)=>{
    try{
        const orders = await Order.find({});//kuch bhi pass nhi kr rhee h->it will give us the list of item{jo bhi pass kr denge}->ek particular id chahiye hoga->{id:userId}->ya kuch aur bhi
        res.json(orders);
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});


//Increment the order status
adminRouter.post("/admin/change-order-status",admin,async (req,res)=>{
    try{
        const {id, status} = req.body;//order
        let order = await Order.findById(id);
        order.status = status;//+=1
        order = await order.save();
        //product = await product.save();//to save updated list in db yhi smjh nhi aaya->deleted product ko save krn
        res.json(order);//deleted product ko send and save kr rhe h 
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});


//chart banane wala section //total earning
adminRouter.get('/admin/analytics',admin, async (req,res)=>{
    try{
        const orders = await Order.find({});
        let totalEarnings = 0;
        //every order ka every product
        for(let i = 0;i<orders.length;i++){
            //har order ke product
            for(j = 0;j<orders[i].products.length;j++){
                totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price;
            }
        }

        // category wise order fetch kr rhe
        let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
        let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
        let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
        let booksEarnings = await fetchCategoryWiseProduct("Books");
        let fashionEarnings = await fetchCategoryWiseProduct("Fashion");


       //earning ka bhi obj bna lete h best rhega
       let earnings = {
        totalEarnings,
        mobileEarnings,
        essentialEarnings,
        applianceEarnings,
        booksEarnings,
        fashionEarnings,
       }

       res.json(earnings);
    }catch(e){
        return res.status(500).json({error: e.message});

    }
});
//const x = async (category)=> {} same h ye bhi
async function fetchCategoryWiseProduct(category){
    let categoryOrders = await Order.find({
        'products.product.category': category,
    });

    let earnings = 0;

    for(let i = 0;i<categoryOrders.length;i++){
        //har order ke product
        for(j = 0;j<categoryOrders[i].products.length;j++){
            earnings += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.price;
        }
    }
    return earnings;
}


module.exports = adminRouter;//and use kroo index.js file me