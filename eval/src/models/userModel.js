const {Schema,model}=require('mongoose')
const {roles}=require('../utils/constant')
const userSchema=new Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    image:{type:String,required:true},
    activity:{type:Boolean,default:true},
    role:{type:String,enum:[roles.admin,roles.organizer,roles.user],default:roles.user}
})
const userModel=model('auths',userSchema)
module.exports=userModel