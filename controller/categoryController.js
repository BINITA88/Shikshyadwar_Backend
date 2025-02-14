
const Category=require('../models/categoryModel')

exports.testFunction=(req, res)=>{
    res.send('this is from th category controller page.')
}


// create (insert the category)
exports.postCategory=async(req,res)=>{
    let category=new Category({
        category_name:req.body.category_name
    })
    Category.findOne({category_name:category.category_name})
    .then(async(categories)=>{
        if(categories){
            return res.status(400).json({error:'category must be unique.'})
        }
        else{
         category=await category.save()
         if(!category){
        // 400 not found
         return res.status(400).json({error:"something went wrong"})
    }
    res.send(category)
}
})
    
}

    // jaba samma mathi bata data autaina save huna bhayana rukera basna paryo await ko kaam 
    


// retrive all data

exports.categoryList=async(req,res)=>{
    const category=await Category.find()
    if(!category){
        // 400 not found
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(category)
}


// to view category detail
exports.categoryDetails=async(req,res)=>{
    const category=await Category.findById(req.params.id)
    if(!category){
        // 400 not found
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(category)
    // use bata data lida params  
}

// update category

exports.updateCategory=async(req,res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,{
            category_name:req.body.category_name
        },
        {new:true}
    )
    if(!category){
        // 400 not found
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(category)
    // use bata data lida params  

}

// FOR UPDATE =>PUT



// delete category

exports.deleteCategory=(req,res)=>{
    Category.findByIdAndDelete(req.params.id)
    .then(category=>{
        if(!category){
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