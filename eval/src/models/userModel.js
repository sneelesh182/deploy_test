const {Schema,model}=require('mongoose')
const userSchema=new Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    image:{type:String,required:true}
})
const userModel=model('auths',userSchema)
module.exports=userModel