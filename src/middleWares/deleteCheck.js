const blogModel=require('../model/blogModel')


const blogDeleteCheck=async function(req,res,next){
    try{
    let blogId=req.params.blogId
    let blogData=await blogModel.findById(blogId)
    if (blogData.isDeleted){
        return res.status(404).send("Blog not Found")
    }
    }catch(err){return res.status(500).send({msg:err})}
    next()
}

module.exports.blogDeleteCheck=blogDeleteCheck