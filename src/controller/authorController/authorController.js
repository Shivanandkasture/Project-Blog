
const authorModel = require("../model/authorModel.js");

const createAuthor = async (req, res) => {
    try {
        let data = req.body;

        if (Object.keys(data).length != 0) {

            let savedData = await authorModel.create(data)

            res.status(201).send({ msg: savedData })
        }
        else {
            res.status(400).send({ msg: "BAD REQUEST" })
        }

    }
    catch (error) {
        res.status(500).send({ msg: " internal server error", ERROR: error.message })
    }
}

module.exports.createAuthor = createAuthor;
