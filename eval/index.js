const express=require('express')
const app=express()
app.use(express.json())

const path=require('path')
const cors=require('cors')
app.use(cors())
const connectDB = require('./src/configs/mongoose')
const auth = require('./src/middleware/auth')
const userRouter = require('./src/routes/userRouter')
const eventRouter = require('./src/routes/eventRoutes')
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
const port=3000
const url="mongodb+srv://test:test@cluster0.co3xz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.use('/user',userRouter)
app.use('/userEvent',auth,eventRouter)
app.listen(port,async()=>{
    try{
        await connectDB(url)
        console.log(`server is running on http://localhost:${port}`)
    }catch(err){
        console.log(err)
    }
})