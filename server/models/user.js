const mongoose = require('mongoose')
const validator = require('validator') //qu'on va utiliser pour notre adresse email, 
//pour etre sur qu'on a bien à faire à une address mail

//bcrypt est une bibliotheque de cryptage de mots de passe utilisée pour securiséer les informtaions
//d'identification des utilisateur.elle transforme les mots de passe en texte clair en version hachées 
//et salées.la salaison: ajoute des données aleatoires uniques à chaque mot de passe
//hachage:processus à sens unique qui empeche de retrouver le mot de passe original.
const bcrypt = require('bcryptjs')
//schema pour user

//notre schema pour user
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,//pour ne pas avoir deux comptes avoir la meme adresse mail
        validate:[validator.isEmail,'Please provide a valid email']//si l'adress email n'est pas valide message à afficher
    },
    password:{
        type:String,
        require:true,
        minlength:[8,'Password must be at least 8 characters long'],
    },
    phone:String,
    address:String,
    role:{
        type:String,
        enum:['client','admin'],//soit on est user client ou user admin
        default:'client'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:Date
},{timestamps:true})

userSchema.pre('save',async function(next){//avant l'enregistrement dans notre base de données

    //si le mot de passe na pas été modifié on a pas besoin de le hacher
    //mais sil a été modifié ou si c'est pendant l'inscription on va hacher le mot de passe, car lors du
    //processus d'inscription le mot de passe est considéré comme modifié
    if(!this.isModified('password')) return next()
    try {
        this.password = await bcrypt.hash(this.password,8)//si non on le hash,8 ici etant le facture de cout,plus il est élévé 
        //plus c'est robuste mais ça prend plus de temps et de ressource.avec 8 on aura 2exposant 8 fois que bcrypt executera son algo de hachage
    } catch (error) {
        next(error);
    }
    next();//pour passer l'erreur au prochain middleware de gestion des erreurs s'il ya erreur
})

//methode pour mettre à jour le mot de passe en cas de modification par l'utilisateur
//on ajoute la methode updatePassword aux methode de notre userSchema
userSchema.methods.updatePassword = async function(newPassword){
    const hashedPassword = await bcrypt.hash(newPassword,8);
    this.password = hashedPassword;
    await this.save();
};

module.exports = mongoose.model('User',userSchema)