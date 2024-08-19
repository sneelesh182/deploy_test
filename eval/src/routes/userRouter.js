const {Router}=require('express')
const userRouter=Router()
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const key="#479@/^5149*@123"
const multer  = require('multer')
const userModel = require('../models/userModel')
const eventModel = require('../models/EventModel')
const auth = require('../middleware/auth')
const { roles } = require('../utils/constant')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
userRouter.post('/register',upload.single('avatar'),async(req,res)=>{
    const {email,password,phone}=req.body
    try{
        const check=await userModel.findOne({email:email})
        if(check){
            return res.status(400).json({message:'User already exists. Please login'})
        }
        const role=email==='admin@gmail.com' ? roles.admin : roles.user
        bcrypt.hash(password, 8, async(err, hash)=> {
            if(err){
                return res.status(400).json({message:'An error occurred. Please try again later'})
            }
            const user=await userModel.create({
                email:email,
                password:hash,
                phone:phone,
                image:req.file.path,
                role:role
            })
            return res.status(201).json({message:'Signup successfull.Login to see events',user})
        });
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})
userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const check=await userModel.findOne({email:email})
        if(!check){
            return res.status(400).json({message:'User does not exist. Please signup'})
        }
        if(!check.activity){
            return res.status(403).json({message:'You have been disabled by admin.'})
        }
        bcrypt.compare(password, check.password, async(err, result)=> {
            if(err){
                return res.status(400).json({message:'An error occurred while verifying password. Try again later'})
            }
            if(result){
                const payload={email:check.email}
                jwt.sign(payload,key,(err,token)=>{
                    if(err){
                        return res.status(400).json({message:'An error has occurred . Please try again later'})
                    }
                    return res.status(200).json({token:token,user:check._id,role:check.role})
                })
            }else{
                return res.status(400).json({message:'Email address and password do not match'})
            }
        });
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})
userRouter.get('/logout',auth,async(req,res)=>{
    try{
            return res.status(200).json({message:'Logout successful'})
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})
userRouter.get('/all',async(req,res)=>{
    try{
        const user=await userModel.find({})
        return res.status(200).send(user)
    }catch(err){
        return res.status(500).json({message:'Internal server error'})

    }
})
userRouter.delete('/:id',async(req,res)=>{
    const {id}=req.params
    try{
        const user=await userModel.findById(id)
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        await eventModel.deleteMany({user:id})
        await userModel.findByIdAndDelete(id)
        return res.status(200).json({message:'User deleted'})
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})
userRouter.get('/admin-route',async(req,res)=>{
    try{
        const user=await userModel.find({role:{$ne:roles.admin}})
        return res.status(200).send(user)
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})
userRouter.patch('/update-role/:id',async(req,res)=>{
    const {id}=req.params
    const {role}=req.body
    try{
        const user=await userModel.findById(id)
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        await userModel.findByIdAndUpdate(id,{role:role},{new:true})
        return res.status(200).json({message:`User role has been updated`})
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})
module.exports=userRouter