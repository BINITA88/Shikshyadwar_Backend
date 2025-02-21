
const mongoose=require('mongoose')
const uuidv1=require('uuidv1')
// Crypto is used for used for hashing the password.
const crypto=require('crypto')
const { type } = require('os')

// define schema

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        // agadi ra pachdi ko space hataucha
        trim:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        // agadi ra pachdi ko space hataucha
        trim:true,

    },
    image:{
        type:String,
        default: null,
    },
    
    contact_no:{
        type:Number,
        default: '',
        // required:true,
    },
    Hashed_password:{
        type:String,
        required:true,
        // agadi ra pachdi ko space hataucha
        trim:true,

    },
   
    // mathiko uuidv1 le random string generate garca so salt bahnni variable banayara rakhni tesma string
    salt:String,
    role:{
        type:Number,
        default:0
        // admin cha bahne 1 otherwise user cha bahne default:0 
    },
    // email verified cah ki chaina ko lagi gareko
    isverified:{
        type:Boolean,
        default:0,
        // default ma O cha bahnesi verified chaina initially.
    }
    },{timestamps:true})

    // virtual field is ._password

    userSchema.virtual('password')
    .set( function(password){
        this._password=password
        this.salt=uuidv1()
        this.Hashed_password=this.encryptPassword(password)
    })
    // .get: Returns the plain text password (_password) if it's ever needed during runtime (though it won’t be saved in the DB).
    .get(function(){
        return this._password
    })



    // This method, encryptPassword, takes the user's plain text password, combines it with the unique salt, and hashes it using the sha1 algorithm.crypto.Hmac('sha1', this.salt): Uses HMAC (Hash-based Message Authentication Code) with the SHA1 algorithm and the generated salt to hash the password..update(password): Updates the hash with the plain text password..digest('hex'): Converts the hashed output into a hexadecimal string.

    userSchema.methods={
        // virtual ma jun parameter legecha tei lekhni funcion ko bitra
        encryptPassword:function(password){
            try{
                // algorithm use garera auta arko string banauni 2 OTTA String garera strong banauni password
                return crypto.Hmac('sha1',this.salt)
                .update(password)
                // hex means 0-9 A-F
                .digest('hex')

            }
            catch(err){
                return err 
            }
        },
        authenticate:function(plainText){
            return this.encryptPassword(plainText)==this.Hashed_password
        }
    }
module.exports=mongoose.model('User',userSchema)
