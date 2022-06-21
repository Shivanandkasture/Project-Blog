const express =require('express');
const { createAuthor } = require('../controller/authorController/authorController');
const { createBlog, getBlogs } = require('../controller/blogController/blogController');
const { blogDeleteCheck } = require('../middleWares/deleteCheck');
const router =express.Router();


router.get('/',(req,res)=>{
    res.status(200).send({msg:"work"})
})


router.post('/authors', createAuthor)

router.post('/blogs', createBlog)

router.get('/blogs', getBlogs )

router.put('/blogs/:blogId', blogDeleteCheck , )

router.delete('/blogs',  )

router.delete('/blogs/:blogId',  )


module.exports = router;