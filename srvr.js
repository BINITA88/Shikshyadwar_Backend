const express = require('express')
const app=express()

require('dotenv').config()
const morgan=require('morgan')


// diff data send garna front bata back ma ors use huncha 
require('./db/connection')
// require is a importt

const categoryRoute=require('./rout/categoryRoute')
const productRoute=require('./rout/productRoute')
const userRoute=require('./rout/userRoute')
const bookingRoute=require('./rout/bookingRoute')
const paymentRoute =require('./rout/payRoutes')
const messageRoutes =require('./rout/messageRoutes')
const ExamSeat =require('./rout/ExamSeatRoute')
const scheduleRoutes = require('./rout/scheduleRoute');
const notificationRoutes = require('./rout/noticeRoute');

const cors=require('cors')
// we use cors for showing it is genuine api to frontend 
app.use(cors({
    origin:process.env.FRONT_END_URL
}
))

// for json
const bodyParser=require('body-parser')
app.use(bodyParser.json())

app.use(morgan('dev'))
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoute);
app.use("/api/seat", ExamSeat);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/notifications', notificationRoutes);


// TO Retrieve image thata is already upload static bhanni define garna parcha
app.use('/public/uploads',express.static('public/uploads'))


// route
app.use('/api',categoryRoute)
app.use('/api',productRoute)
app.use('/api',userRoute)
app.use('/api',bookingRoute)
app.use('/api',paymentRoute)





// app.use('/',(req,res)=>{
//     res.json({message:'This is a express servr class'})
// })
const port=process.env.PORT || 7000


app.listen(port,()=>{
    console.log(`server startd at port ${port}`)
})
