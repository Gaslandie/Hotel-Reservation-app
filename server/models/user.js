const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')//pour crypter le mot de passe avant de le sauvegarder

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    phone:String,
    address:String,
    role:{
        type:String,
        enum:['client','admin'],
        default:'client'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,8)
    next();
})

module.exports = mongoose.model('User',userSchema)