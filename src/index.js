const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const router =require('./router/route')
const app =express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// CONNECT DB
const url = "mongodb+srv://shivanandkasture:GrjERPPxK02MvUW6@cluster0.a35v6.mongodb.net/Project-Blog-DB?retryWrites=true&w=majority";
mongoose.connect(url,{ useNewUrlParser: true, }).then(()=>console.log('MongoDb is connected')).catch((err)=>console.log(err))

app.use('/',router)

app.listen(3000,()=>{
    console.log(`Express app running on port ${3000}`)
})