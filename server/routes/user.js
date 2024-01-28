const express = require('express');
const Joi = require('joi');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware')

//schema joi pour l'inscription
const signupSchema = Joi.object({
    name:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required(),
    phone:Joi.string(),
    address:Joi.string(),
    role:Joi.string().valid('client','admin')
});

//Schema Joi pour la connexion
const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password: Joi.string().required()
});

//Schema Joi pour la mise à jour du profil
const updateSchema = Joi.object({
    name : Joi.string(),
    email:Joi.string().email(),
    phone:Joi.string(),
    address:Joi.string(),
    role:Joi.string().valid('client','admin')
}).min(1)//au moins une des propriétés doit etre fournie pour la mise à jour 

//Middleware de validation pour l'inscription
const validateSignup = (req,res,next) => {
    const {error} = signupSchema.validate(req.body);
    if(error) return res.status(400).send(error.details);
    next();
};

//middleware de validation pour la connexion
const validateLogin = (req,res,next) => {
    const {error} = loginSchema.validate(req.body);
    if(error) return res.status(400).send(error.details);
    next();
}

//middleware de validation pour la mise à jour du profil
const validateUpdate = (req,res,next) => {
    const { error } = updateSchema.validate(req.body);
    if(error) return res.status(400).send(error.details);
    next();
}

//Route pour l'inscription
router.post('/signup',validateSignup,userController.userSignup);

//Route pour la connexion
router.post('/login',validateLogin,userController.userLogin);

//Route de mise à jour du profil
router.put('/update',validateUpdate,protect,userController.updateUserProfile);

module.exports = router;