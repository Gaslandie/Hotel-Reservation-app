const express = require('express');
const Joi = require('joi');
const router = express.Router();
const userController = require('../controllers/userController');
const {protect}  = require('../middlewares/authMiddleware')



//schema joi pour l'inscription
const signupSchema = Joi.object({
    name:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required(),
    phone:Joi.string(),
    address:Joi.string(),
    role:Joi.string().valid('client','admin')
});
//Middleware de validation pour l'inscription
const validateSignup = (req,res,next) => {
    const {error} = signupSchema.validate(req.body);
    if(error) return res.status(400).send(error.details);
    next();
};




//Schema Joi pour la connexion
const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password: Joi.string().required()
});
//middleware de validation pour la connexion
const validateLogin = (req,res,next) => {
    const {error} = loginSchema.validate(req.body);
    if(error) return res.status(400).send(error.details);
    next();
}


//Schema Joi pour la mise à jour du profil
const updateSchema = Joi.object({
    name : Joi.string(),
    email:Joi.string().email(),
    phone:Joi.string(),
    address:Joi.string(),
    role:Joi.string().valid('client','admin')
}).min(1)//au moins une des propriétés doit etre fournie pour la mise à jour 

//middleware de validation pour la mise à jour du profil
const validateUpdate = (req,res,next) => {
    const { error } = updateSchema.validate(req.body);
    if(error) return res.status(400).send(error.details);
    next();
}
/**
 * @swagger
 * path:
 *   /api/users/signup:
 *     post:
 *       summary: Register a new user
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 role:
 *                   type: string
 *               required:
 *                 - name
 *                 - email
 *                 - password
 *       responses:
 *         '201':
 *           description: A new user has been registered
 *         '400':
 *           description: Bad request. Validation error or missing required fields.
 */
router.post('/signup',validateSignup,userController.userSignup);

/**
 * @swagger
 * path:
 *   /api/users/login:
 *     post:
 *       summary: Login as a user
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         '201':
 *           description: Successfully logged in as a user
 *         '400':
 *           description: Bad request. Validation error or missing required fields.
 *         '401':
 *           description: Unauthorized. Invalid credentials.
 */
router.post('/login',validateLogin,userController.userLogin);


/**
 * @swagger
 * path:
 *   /api/users/update:
 *     put:
 *       summary: Update user profile
 *       tags: [Users]
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 role:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - name
 *       responses:
 *         '200':
 *           description: User profile updated successfully
 *         '400':
 *           description: Bad request. Validation error or missing required fields.
 *         '401':
 *           description: Unauthorized. User not authenticated.
 */
router.put('/update',protect,validateUpdate,userController.updateUserProfile);

module.exports = router;




