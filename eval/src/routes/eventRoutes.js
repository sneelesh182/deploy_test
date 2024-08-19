const {Router}=require('express')
const auth = require('../middleware/auth')
const rateLimit = require('express-rate-limit');
const eventModel = require('../models/EventModel')
const eventRouter=Router()
eventRouter.use(auth)
const registerLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1, // limit each IP to 1 requests per windowMs
    message: "You can only register for an event once per day",
    keyGenerator: (req) => req.user._id.toString() // use user ID as key
  });
  
eventRouter.get('/',async(req,res)=>{
    try{
        const event=await eventModel.find({user:req.user._id}).populate('user','email phone image activity role')
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
eventRouter.get('/all',async(req,res)=>{
    try{
        const event=await eventModel.find({user:{$ne:req.user._id}}).populate('user','email phone image activity role')
        return res.status(200).send(event)
    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
})
eventRouter.get('/register-event/:id', registerLimiter, async (req, res) => {
    const { id } = req.params;
    try {
        const event = await eventModel.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }
        if (event.registeredUsers.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is already at full capacity' });
        }
        
        event.registeredUsers.push(req.user._id);
        event.price = Math.ceil(event.price * 1.1); // Increase price by 10%
        await event.save();
        
        const registeredEvents = await eventModel.find({ registeredUsers: req.user._id })
            .populate('user', 'email phone image activity role');
        return res.status(200).json(registeredEvents);
    } catch (err) {
        console.error('Error registering for event:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports=eventRouter