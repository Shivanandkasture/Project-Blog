const mongoose = require("mongoose");
const objectId= mongoose.Schema.Types.ObjectId
const blogSchema= new mongoose.Schema({
    title:{
        type: String,
         required : true,
         trim:true
    },
    body:{
        type: String,
        required: true,
        trim:true
    },
     authorId:{
        type : objectId,
        ref: "author",
        required: true,
        trim:true
     },
     tag:{
        type: [String],
        required :true
     },
     catagory:{
        type: String,
        required: true,
        trim:true
     }, 
     subcatogry:{
        type: [String],
        required: true
     },
     deletedAt:{
        type: Date,
        default: ""
     },
     isDeleted:{
        type: Boolean,
        default: false
     },
     publishedAt:{ 
        type: Date,
        default: Date.now
     },
     isPublished:{
      type: Boolean,
      default: false
      }
     },{timestamps: true})


module.exports= mongoose.model("Blog",blogSchema ) 


