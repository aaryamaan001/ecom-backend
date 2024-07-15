const express = require('express');
const productRouter = express.Router();

//middleware of auth
const auth = require('../middlewares/auth');
const { Product } = require('../models/product');

//we wont be able to give body in the get req vo bs post me hota h->url me hi body de denge /api/product?category= Essentials->aise pass to krenge lekn getch kaise krenge->req ka  use krke
productRouter.get("/api/products/",auth,async (req,res)=>{// products ke baad / lgana jaruri h nhi to error aa rha tha
    try{
        //? ke jagah : use krenge to->req.params.category use krenge
        // console.log(req.query.category);
        //essential de dega  ye//req.query->?mark ke pehle ka sb de dega
        const products = await Product.find({ category: req.query.category });
        res.json(products);        //kuch bhi pass nhi kr rhee h->it will give us the list of item{jo bhi pass kr denge}->ek particular id chahiye hoga->{id:userId}->ya kuch aur bhi
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});

// thoda alg h ye 
// /api/product/search/:i/:dfd-> req.params.i / req.params/dfd 
                                        //searchQuery bhi likh doge to chlega
productRouter.get("/api/products/search/:name",auth,async (req,res)=>{// products ke baad / lgana jaruri h nhi to error aa rha tha
    try{
        //rejx use kiye the email ko validate krne ke liye->rajx is used to search pattern
        const products = await Product.find({
            name: {$regex: req.params.name, $options: "i"}
        });// iphone naaame h n i likhenge tb bhi de dega-> name : req.params.name krte to exact name janna hota
        res.json(products);       
    }catch(e){
        return res.status(500).json({error: e.message});
    }
});


// create a post request route to rate the product
//ye seekh lo to alsmost ab sb ho gyaa h
productRouter.post('/api/rate-product',auth,async(req,res)=>{
    try{
        const{id,rating} = req.body;
        let product = await Product.findById(id);
        
        for(let i = 0;i<product.ratings.length;i++){
            if(product.ratings[i].userId == req.user){//req.user userid de rha auth middlleware ke karan
                product.ratings.splice(i,1);//add or delete anything if we have access to index
                break;
            }   
        }                    //i se start krke 1 element delete krenge
            //extra rating will be removed
            //now add the current rating
            const ratingSchema = {
                userId: req.user,
                rating,
            };
                //add
            product.ratings.push(ratingSchema);
            product = await product.save();

            res.json(product);
        
        //go to all the product rating
        //userID: dfsd
        //rating:2.5
        //userID: dffdsd
        //rating:2
        //userID: dffjdsfsd
        //rating:5

    }catch(e){
        res.status(500).json({error: e.message});
    }
})

//Highest rated products
productRouter.get("/api/most-rated", auth, async (req, res) => {
    try {
      let products = await Product.find({});
    
    // sort the product in descendig order of sorting
      products = products.sort((a, b) => {
        let aSum = 0;
        let bSum = 0;
  
        for (let i = 0; i < a.ratings.length; i++) {
          aSum += a.ratings[i].rating;
        }
        let aAvg = aSum/a.ratings.length;
  
        for (let i = 0; i < b.ratings.length; i++) {
          bSum += b.ratings[i].rating;
        }
        let bAvg = bSum/b.ratings.length;

        return bAvg-aAvg;
      });
  
      res.json(products);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });


module.exports = productRouter;