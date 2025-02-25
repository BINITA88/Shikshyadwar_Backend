
// databse ko strucr

const mongoose=require('mongoose')

// naya sc

const categorySchema=new mongoose.Schema({
    category_name:{
        type:String,
        // required:true,
        default: '',
        unique:true,
        // agadi ra pachdi ko space hataucha
        trim:true,

    }
},{timestamps:true})
// create at ra updated at 
// model firstname be captial letter
module.exports=mongoose.model('Category',categorySchema)