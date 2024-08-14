const jwt=require('jsonwebtoken')
const userModel = require('../models/userModel')
const key="#479@/^5149*@123"
const blackList=new Set()

const auth=async(req,res,next)=>{
    const header=req.headers.authorization
    if(!header){
        return res.status(400).json({message:'Invalid headers'})
    }
    const token=header.split(' ')[1]
    if(!token){
        return res.status(400).json({message:'Invalid token'})
    }
    if(blackList.has(token)){
        return res.status(400).json({message:'this token is blacklisted'})
    }
    try{
        const decode=jwt.verify(token,key)
        if(!decode){
            return res.status(400).json({message:'An error occurred while verifying token'})
        }
        req.user=await userModel.findOne({email:decode.email})
        if(!req.user){
            return res.status(400).json({message:'Unauthorized access'})
        }
        next()
    }catch(err){
        return res.status(500).json({message:'Internal server error'})

    }
}
module.exports=auth