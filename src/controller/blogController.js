const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");
const mongoose = require("mongoose");

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    if (Object.keys(req.body).length == 0)
      return res.status(400).send({ status: false, msg: "fill all fields" });

    if (!req.body.authorId)
      return res
        .status(400)
        .send({ status: false, msg: "please enter authorID" });

    if (!mongoose.isValidObjectId(req.body.authorId))
      return res
        .status(400)
        .send({ status: false, msg: "please enter valid authorID" });

    const author = await authorModel.findById(req.body.authorId);
    if (!author)
      return res
        .status(400)
        .send({ status: false, msg: "no such author present" });

    const data = await blogModel.create(req.body);

    return res.status(201).send({ status: true, data });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, msg: err.message });
  }
};


// GET BLOGS
const getBlogs = async (req, res) => {
    try{
        let filter = req.query;
        filter.isDeleted =false
        filter.isPublished =true
        const data = await blogModel.find(filter);
        if(!(data.length > 0)) return res.status(404).send({status:false,msg:"Blog not Found"});
        if(Object.keys(req.query).length == 0){
            return res.status(200).send({status:true, data})
        }else{
            const filterData = await blogModel.find(filter);
            
            if(filterData.length <= 0) return res.status(404).send({status:false, msg:"Not found blog"})

            return res.status(200).send({status:true, data:filterData})
        }
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
};

// UPDATE BLOGS
const updateBlog = async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data).length == 0)
      return res.status(400).send({ status: false, msg: "fill all fields" });
    const blogId = req.params.blogId;
    const blog = await blogModel.findById(blogId);
    if (!blog)
      return res
        .status(400)
        .send({ status: false, msg: "no such Blog present" });

    if (data.tag) blog.tag.push(data.tag);
    if (data.subcatogry) blog.subcatogry.push(data.subcatogry);
    blog.title = data.title;
    blog.body = data.body;
    blog.isPublished = true;
    blog.publishedAt = new Date();

    const updateData = await blog.save();

    return res.status(200).send({ status: true, data: updateData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// DELETE

const deleteBlog = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    if (!blogId)
      return res
        .status(400)
        .send({ status: false, msg: "please enter BlogId" });
    if (!mongoose.isValidObjectId(blogId))
      return res
        .status(400)
        .send({ status: false, msg: "please enter valid BlogId" });
    await blogModel.findByIdAndUpdate(blogId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    return res.status(200).send({ status: true });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// DELETE BLOG BY Any
const deleteBlogByAny = async (req, res) => {
  try {
    const { tag, subcatogry, isPublished, authorId, catagory } = req.query;
    const filterData = await blogModel.updateMany(
      {
        $or: [
          { tag: { $in: [tag] } },
          { subcatogry: { $in: [subcatogry] } },
          { isPublished },
          { authorId },
          { catagory },
        ],
      },
      { isDeleted: true, deletedAt: new Date() }
    );
    if (filterData) res.status(200).send({ succes: true });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createBlog = createBlog;
module.exports.getBlogs =   getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByAny = deleteBlogByAny;
