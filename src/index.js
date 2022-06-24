const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const router =require('./router/route')
const app =express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


const url = "mongodb+srv://sourabh:sourabh@cluster0.k4izw.mongodb.net/projectblog?retryWrites=true&w=majority";
mongoose.connect(url,{ useNewUrlParser: true, }).then(()=>console.log('connect mongoDB')).catch((err)=>console.log(err))



app.use('/',router)

app.listen(3000,()=>{
    console.log(`server Start on ${3000}`)
})