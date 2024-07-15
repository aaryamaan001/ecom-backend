// console.log("Hello, World");
// //print('Hello, World')
//Node is JS evm->all code is in js

//inport from package
const cors = require("cors");
const express = require("express");// 3rd party h na to import krna padega
     // xyz naame ho skta//import 'package:express/express.dart
const mongoose = require("mongoose");


//import  from other files
const authRouter = require("./routes/auth");
const e = require('express');
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/products");
const userRouter = require("./routes/user");
//iske baad bhi nhi hoga,Private type h->vha jaake export krna padega module wagera use krke

     ///init
const PORT = process.env.PORT || 3000;//convention 3000
// initialize kr kre express.initilize()
const app = express(); //app variable me initalize kr diye h
app.use(cors());

// const corsOptions = {
//     origin: 'https://aaryamaan001.github.io/home-buyer/', // Replace with your Flutter web app's domain
//   };
  
//   app.use(cors(corsOptions));




const DB = "mongodb+srv://Aaryamaan:Aaryamaan@cluster0.zthl4uw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";






//1 dusra file me route bnaya -> iss file me aake route ko init kiya -> vha jaake rout ko export kiya->middleware 
//cliend->middleware->server->client
app.use(express.json());// ye thunder light me destructure wala issue aa rha tha{email,name}wale structure ke karan
app.use(authRouter);//ab node js know about the existance
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);


//Connections-> we will make connectioins fot mongoose
mongoose.connect(DB).then(()=>{
    console.log('Connection successful');
}).catch((e)=>{
    console.log(e);
});//url->then coz future ya promise->function hota to await kr dete->isliye .then use kr liye
// connection setup -> ab signup me jao



//Creating an API using express
//GET PUT POST DELETE UPDATE
//1 get ko krke dekhenge
app.get("/hello-world",(req,res) =>{
    res.json({this:"This is first api call"});
    //send will send in text format 
    // json will send json response-> hi:"THis"key and value
});
//created



//json response with key of name and value of your name
app.get("/xyz",(req,res)=>{
    res.json({name:"Aaryamaan Singh Chauhan"});
});


                //can be accessed from anywhere-> android stimulator is not able to take local host
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`connected at the port ${PORT}`);
});
    
    //$PORT"XX in js //+ bhi nho good
//app will bind itself to the host and listen for any other connections
                        // 2 way function(){}
//port, HOST ADDRESS ,call back function->(){} in dart
        //IP address nhi specify krenge to local host le lega
// it will access LOCAL Host->ka ip 127.0.0.1->computer is taking to itself
// when you call an ip address on your computer-> you try to connect other computer in the internet


//NODEMON DEpendency add kiye 
//coz vo krna tha
//baar baar save krke run krna nhi padta exit the terminal and restart
//bs save krlo ho jaayega sb RS for restart