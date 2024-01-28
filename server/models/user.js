const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')//pour crypter le mot de passe avant de le sauvegarder

//schema pour user
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

userSchema.pre('save',async function(next){//avant l'enregistrement dans notre base de données
    if(!this.isModified('password')) return next()//si le mot de passe est le meme que celui deja hashé, on a pas besoin de le hasher
    this.password = await bcrypt.hash(this.password,8)//si non on le hash
    next();
})

module.exports = mongoose.model('User',userSchema)