const jwt = require('jsonwebtoken');
const blogModel = require("../model/blogModel");
const { isVaildObjectId } = require("mongoose");

// Authentication 
const authentication = async (req, res, next) => {
    try {
        const token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "user has no token" });

        const authorDetail = jwt.verify(token, "ROOM 26(shubhra,shivanand,sourabh,shiv)/blog-project-1");

        req.authorDetail = authorDetail;

        next()

    } catch (error) { return res.status(500).send({ status: false, msg: error.message }) }
}

//Authorisation
const authorisation = async (req, res, next) => {

    try {
        let authorid = req.params.authorId;

        let token = req.headers["x-auth-token"];

        if (!authorid) return res.status(400).send({ status: false, msg: "Please enter authorId." });

        if (!isVaildObjectId(authorid)) return res.status(400).send({ status: false, msg: "Please enter vaild authorId." });

        let userDetails = await blogModel.findById(authorid);

        if (!userDetails) return res.status(404).send({ status: false, msg: 'No such user exists' })

        const tokenDecoded = jwt.verify(token, "ROOM 26(shubhra,shivanand,sourabh,shiv)/blog-project-1");

        if (userDetails._id != tokenDecoded._id) return res.status(403).send({ status: false, msg: "User logged is not allowed to modify the requested users data" })

        next();

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message });
    }



}



module.exports = authentication
module.exports.authorisation = authorisation;