
const Product =require('../models/productModel')

// create (insert the product)
exports.postProduct=async(req,res)=>{
    let product=new Product({

        product_name:req.body.product_name,
        product_price:req.body.product_price,
        duration:req.body.duration,
        instructor:req.body.instructor,
        product_description:req.body.product_description,
        product_image:req.file.path,
        category:req.body.category,
        
    })
    // jaba samma mathi bata data autaina save huna bhayana rukera basna paryo await ko kaam 
    product=await product.save()
    if(!product){
        // 400 not found
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(product)
}

// retrive all data

exports.productList=async(req,res)=>{
    const product = await Product.find().populate('category', 'category_name');
    if(!product){
        // 400 not found
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(product)
}


const mongoose = require('mongoose');


exports.productDetails = async (req, res) => {
    // Validate the `id` parameter
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        // Find the product by ID and populate the category
        const product = await Product.findById(req.params.id).populate('category', 'category_name');
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.send(product);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};



// update category

exports.updateProduct=async(req,res)=>{
    const product =await Product.findByIdAndUpdate(
        req.params.id,{
            product_name:req.body.product_name,
            product_price:req.body.product_price,
            duration:req.body.duration,
            product_description:req.body.product_description,
            product_image:req.file.path,
            category:req.body.category,
            
        },
        {new:true}
    )
    if(!product){
        // 400 not found
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(product)
    // use bata data lida params  

}



// delete category

exports.deleteProduct=(req,res)=>{
    Product.findByIdAndDelete(req.params.id)
    .then(product=>{
        if(!product){
            // 400 not found
            return res.status(404).json({error:"category with that id is not found"})
        }else{
            return res.status(200).json({message:"category deleted"})
        }

       
    })
    .catch(err=>{
        return res.status(400).json({error:err})

    })
}