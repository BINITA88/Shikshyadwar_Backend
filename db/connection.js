const mongoose=require('mongoose')

// TO READ DO PROCESS
mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log("DATABASE CONNECTED")
})
.catch(err=>console.log(err))
