const jwt = require('jsonwebtoken');
const blogModel = require("../model/blogModel");
const mongoose = require("mongoose");

// Authentication 
const authentication = async (req, res, next) => {
    try {
        const token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "user has no token" });

        const authorDetail = jwt.verify(token, "ROOM 26(shubhra,shivanand,sourabh,shiv)/blog-project-1");
        next()

    } catch (error) { return res.status(500).send({ status: false, msg: error.message }) }
}

//Authorisation
const authorisation = async (req, res, next) => {

    try {
        let blogId = req.params.blogId;

        let token = req.headers["x-api-key"];

        if (!blogId) return res.status(400).send({ status: false, msg: "Please enter blohId." });

        //  verify blogId ObjectId 

        if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "Please enter vaild blogId." });

        let userDetails = await blogModel.findById(blogId);

        const tokenDecoded = jwt.verify(token, "ROOM 26(shubhra,shivanand,sourabh,shiv)/blog-project-1");

        if (!userDetails) return res.status(404).send({ status: false, msg: 'No such blog exists' })

        if (userDetails.authorId != tokenDecoded._id) return res.status(403).send({ status: false, msg: "User logged is not allowed to modify the requested users data" })

        next();

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message });
    }



}



module.exports.authentication = authentication
module.exports.authorisation = authorisation;