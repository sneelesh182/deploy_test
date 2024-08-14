const {Schema,model}=require('mongoose')
const mongoose=require('mongoose')
const eventSchema=new Schema({
    eventName:{type:String,required:true},
    price:{type:Number,required:true},
    capacity:{type:Number,required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'auths',required:true}
})
const eventModel=model('userEventsss',eventSchema)
module.exports=eventModel