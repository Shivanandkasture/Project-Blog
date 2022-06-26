const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");
const mongoose = require("mongoose");

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    if (req.body.tag) req.body.tag = req.body.tag.trim()

    if (req.body.subcatogry) req.body.subcatogry = req.body.subcatogry.trim()

    if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "fill all fields" });

    if (!req.body.authorId) return res.status(400).send({ status: false, msg: "please enter authorID" });

    if (!mongoose.isValidObjectId(req.body.authorId)) return res.status(400).send({ status: false, msg: "please enter valid authorID" });

    const author = await authorModel.findById(req.body.authorId);

    if (!author) return res.status(400).send({ status: false, msg: "no such author present" });

    const data = await blogModel.create(req.body);

    return res.status(201).send({ status: true, data });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


// GET BLOGS
const getBlogs = async (req, res) => {
  try {
    let onlythisValue = ["authorId", "catagory", "tag", "subcatogry"];
    let store = onlythisValue.some(ele => Object.keys(req.query).includes(ele));
   
    let filter = req.query;
    filter.isDeleted = false
    filter.isPublished = true
    console.log(filter)

    const data = await blogModel.find(filter);

    if (!(data.length > 0)) return res.status(404).send({ status: false, msg: "Blog not Found" });

    if (Object.keys(filter).length == 2) {

      return res.status(200).send({ status: true, data })
    }
    else {
      if (!store) return res.status(400).send({ status: false, msg: "You can't filter this value" })

      const filterData = await blogModel.find(filter);

      if (filterData.length <= 0) return res.status(404).send({ status: false, msg: "Not found blog" })

      //   if (filterData.length <= 0) return res.status(404).send({ status: false, msg: "Not found blog" })

      return res.status(200).send({ status: true, data: filterData })
    }
  }
  catch (err) { res.status(500).send({ status: false, msg: err.message }) }
};

// UPDATE BLOGS
const updateBlog = async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "fill all fields" });

    const blogId = req.params.blogId;

    const blog = await blogModel.findById(blogId);

    if (!blog || (blog.isDeleted === true)) return res.status(400).send({ status: false, msg: "no such Blog present" });

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

// DELETE BY BLOGID

const deleteBlogById = async (req, res) => {
  try {
    let blogId = req.params.blogId;

    if (!blogId) return res.status(400).send({ status: false, msg: "please enter BlogId" });

    if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "please enter valid BlogId" });

    const filter = {}
    filter._id = blogId
    filter.isDeleted = false
    //console.log(filter)

    const data = await blogModel.updateOne(filter, { isDeleted: true, deletedAt: new Date(), });

    if (data.matchedCount === 0) return res.status(404).send({ status: false, msg: " Blog not found" });

    return res.status(200).send({ status: true });

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// DELETE BLOG BY QUERY
const deleteBlogByQuery = async (req, res) => {
  try {
    let filter = req.query;
    filter.isDeleted = false
    filter.isPublished = false

    if (Object.keys(filter).length == 2) return res.status(400).send({ status: false, message: "Please Enter Query" })
    //console.log(filter);

    let data = await blogModel.find(filter).count();
    //console.log(data);
    if (!data) return res.status(404).send({ status: false, message: "no such data exists" })

    await blogModel.updateMany({ filter }, { $set: { isDeleted: true, deletedAt: new Date } }, { new: true })
    res.send({ status: true, data: "update " })
  } catch (err) {
    res.status(500).send({ status: false, Error: err.message });
  }
};


module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteBlogByQuery = deleteBlogByQuery;
