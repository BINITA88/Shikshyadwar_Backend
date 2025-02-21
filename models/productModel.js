const mongoose=require('mongoose')

// kun category ko id tanna object banauni.object Id is used to link data between the different collection(table)
const {ObjectId}=mongoose.Schema
const productSchema=new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        // agadi ra pachdi ko space hataucha
        trim:true,

    },
    product_price:{
        type:Number,
        required:true,
    },

    instructor: {
        type: String,
        required: true, // Set this to true or false based on your requirements
      },
    duration: {
        type: String,
        required: true, // e.g., "2 months", "6 weeks"
    },
 

    product_description:{
        type:String,
        require:true
    },
    product_image:{
        type:String,
        require:true
    },
    category:{
     type:ObjectId,
     default: '',
     ref:"Category"
    }
},{timestamps:true})
module.exports=mongoose.model('Product',productSchema)