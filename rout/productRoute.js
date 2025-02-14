const express=require('express')
const { postProduct, productList, productDetails, updateProduct, deleteProduct } = require('../controller/productController')
const upload =require('../middleware/fileupload')


const router=express.Router()
const{productValidation,validation}=require("../validation/Validator")
const { requireSignin, requireAdmin } = require('../controller/userController')


router.post('/postproduct', 
    upload.single('product_image'), postProduct)
    
// router.post('/postproduct', requireSignin,requireAdmin, 
// upload.single('product_image'),productValidation,validation, postProduct)


router.get('/productlist',productList)
// admin le access garna sakni wala prooduct details jasma signin huna parcha 
// router.get('/productDetails/:id',requireSignin,requireAdmin, productDetails)

// user le access garna sakni wala ptoduct details (put path diff )
router.get('/productDetail/:id',productDetails)
router.put('/updateProduct/:id', requireSignin,requireAdmin,
upload.single('product_image'),productValidation,validation,updateProduct)
router.delete('/deleteProduct/:id', requireSignin,requireAdmin,deleteProduct)

module.exports=router
