const {Router}=require('express')
const auth = require('../middleware/auth')
const eventModel = require('../models/EventModel')
const eventRouter=Router()
eventRouter.use(auth)
eventRouter.get('/',async(req,res)=>{
    try{
        const event=await eventModel.find({user:req.user._id}).populate('user','email phone image')
        return res.status(200).send(event)
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})
eventRouter.post('/',async(req,res)=>{
    const {eventName,price,capacity}=req.body
    try{
        const event=await eventModel.create({
            eventName:eventName,
            price:price,
            capacity:capacity,
            user:req.user._id
        })
        return res.status(201).send(event)
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})
eventRouter.delete('/:id',async(req,res)=>{
    const {id}=req.params
    try{
        const event=await eventModel.findById(id)
        if(!event){
            return res.status(404).json({message:'Event not found'})
        }
        await eventModel.findByIdAndDelete(id)
        return res.status(200).json({message:'Event deleted'})
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})

module.exports=eventRouter