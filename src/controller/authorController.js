
const authorModel = require("../model/authorModel");
const {sign}=require('jsonwebtoken')

// CREATE  AUTHOR
const createAuthor = async (req, res) => {
    try {
        let data = req.body;

        if (Object.keys(data).length != 0) {

            let savedData = await authorModel.create(data)

            res.status(201).send({status:true,  data: savedData })
        }
        else {
            res.status(400).send({status:false, msg: "BAD REQUEST" })
        }

    }
    catch (error) {
        res.status(500).send({status:false, msg:error.message })
    }
}

// LOGIN AUTHOR
const loginAuthor = async (req,res)=>{
    try{
    let{email,password}=req.body //email and password empty or not

    if(!email || !password) return res.status(400).send({status:false,msg:"email and password required"})
    //email valid or not

    email=email.trim()
    if(!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)))return res.status(400).send({status:false,msg:"Enter a valid Email"})
    //find by email and password

    email=email.toLowerCase()
    
    let authorDetail=await authorModel.findOne({email,password})

    if(!authorDetail) return res.status(404).send({status:false,msg:"email or password is invalid"})

    let token=sign({_id:authorDetail._id},"ROOM 26(shubhra,shivanand,sourabh,shiv)/blog-project-1")

    return res.status(200).send({status:true,TOKEN:token})

    }catch(err){return res.status(500).send({status:false,msg:err.massage})}
}
module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;
