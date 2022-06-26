const express =require('express');
const { createAuthor,loginAuthor} = require('../controller/authorController');
const { createBlog, getBlogs ,updateBlog ,deleteBlogById ,deleteBlogByQuery} = require('../controller/blogController');
const {authentication, authorisation} = require('../middleWares/auth');
const blogModel = require("../model/blogModel");

const router =express.Router();

// API'S
router.post('/authors', createAuthor)

router.post('/author/login', loginAuthor)

router.post('/blogs', authentication, createBlog)

router.get('/blogs', authentication, getBlogs ) 

router.put('/blogs/:blogId',authentication, authorisation ,updateBlog )

router.delete('/blogs',authentication, deleteBlogByQuery )

router.delete('/blogs/:blogId',authentication, authorisation, deleteBlogById )

 // deleted  reset Data 
router.put('/blogsup',async (req,res)=>{
    await blogModel.updateMany( { $lt : 50, isDeleted : true},{isDeleted:false,deletedAt:null,isPublished:true})
    res.send("done")
} )

 

module.exports = router;