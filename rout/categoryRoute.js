const express=require('express')
const { testFunction, postCategory, categoryList, categoryDetails, updateCategory, deleteCategory } = require('../controller/categoryController')
const router=express.Router()
const{categoryValidation,validation}=require("../validation/Validator")
const { requireSignin, requireAdmin } = require('../controller/userController')


router.get('/demo',testFunction)
router.post('/postcategory', postCategory)
router.get('/categoryList',categoryList)
router.get('/categoryDetails/:id',categoryDetails)
// router.put('/updateCategory/:id', categoryValidation, validation,requireSignin,requireAdmin, updateCategory)
// router.delete('/deleteCategory/:id',requireSignin,requireAdmin, deleteCategory)
router.put('/updateCategory/:id',updateCategory)
router.delete('/deleteCategory/:id', deleteCategory)


module.exports=router
// json data lai read garna haldel 