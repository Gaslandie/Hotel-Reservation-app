const Room = require('../models/room');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');



//Inscription
exports.userSignup = async (req,res) => {
    try {
        const { name,email,password,phone,address,role } = req.body;
        //creation d'un nouvel utilisateur
        const newUser = await User.create({name,email,password,phone,address,role});

        //creation du token
        const token = jwt.sign({id:newUser._id},
                                process.env.JWT_SECRET,
                                {expiresIn:process.env.JWT_EXPIRES_IN});
        res.status(201).json({success:true,data:newUser,token});
    } catch (error) {
        res.status(400).json({success:false,error:error.message});
    }
}

//Connexion(login)
exports.userLogin = async (req,res) => {
    try {
        const { email,password} = req.body;

        //Trouver l'utilisateur par email
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(404).json({success:false,message:'User not found'});
        }

        //verifier le mot de passe
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({sucess:false,message:'Invalid credentials'});
        }
       
        //convertir le document Mongoose en objet et supprimer le mot de passe
        const userObj = user.toObject();
        delete userObj.password;
         //Generer un token
         const token = jwt.sign({id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN});
res.status(201).json({success:true,data:user,token});
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
    }
}

//mise à jour du profil
exports.updateUserProfile = async (req,res) => {
    try {
        const {name,email,phone,address,role,password} = req.body;
        const userId = req.user.id

        const userUpdateData = {name,email,phone,address,role};

        //si un nouveau mot de passe est fourni,hachez-le avant de l'appliquer
        if(password){
            const hashedPassword = await bcrypt.hash(password,8);
            userUpdateData.password = hashedPassword;
        }
        //Mise à jour de l'utilisateur
        const updateUser = await User.findByIdAndUpdate(userId,userUpdateData,{new:true}).select('-password');
        res.status(200).json({success:true,data:updateUser});
    } catch (error) {
        res.status(400).json({success:false,error:error.message})
    }
}