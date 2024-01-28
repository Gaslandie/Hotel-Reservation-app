//Requête HTTP -> Route -> Middleware(s) -> Contrôleur -> Base de Données (si nécessaire) -> Contrôleur -> Réponse HTTP


const express = require('express');

//Joi est une bibliotheque qui nous permet de s'assurer que les données entrantes respectent un format attendu,sont sures et fiables
const Joi = require('joi')
const router = express.Router();
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');

//Schema joi pour la validation des données entrantes
const roomSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    booked: Joi.boolean().required(),
    size: Joi.string().required()
    
})


//Middleware pour valider les données de la chambre
const validateRoom = (req,res,next) => {
    //destructuration car la methode validate nous renvoie un objet qui contient deux propriétes principales:error et  value
    //on recupere value et on affiche les details
    const { error } = roomSchema.validate(req.body);
    if(error) {
        return res.status(400).send(error.details);
    }
    next();
}


router.get('/', getRooms);
router.post('/',validateRoom, createRoom);
router.put('/:id',validateRoom, updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;

