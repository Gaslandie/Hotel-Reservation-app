const express = require('express');
const Joi = require('joi');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getUserReservations, createReservation, updateReservation, cancelReservation } = require('../controllers/reservationController');

//valider le format des données entrante pour la creation de reservation
const reservationCreateSchema = Joi.object({
    room: Joi.string().length(24).alphanum().required(), // Exemple de validation plus stricte pour un ObjectId
    user: Joi.string().length(24).alphanum().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required().greater(Joi.ref('startDate')),
});

//valider le format des données entrante pour la mise à jour de reservation
const reservationUpdateSchema = Joi.object({
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    room: Joi.string(),
}).or('startDate', 'endDate', 'room'); // s'assurer qu'au moins un champ est fourni pour la mise à jour


//après avoir verifier le format,on valide les données
const validateReservationCreate = (req, res, next) => {
    const { error } = reservationCreateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, error: error.details[0].message });
    }
    next();
};

const validateReservationUpdate = (req, res, next) => {
    const { error } = reservationUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, error: error.details[0].message });
    }
    next();
};


const router = express.Router();

router.route('/').post(protect,validateReservationCreate, createReservation);
router.route('/user').get(protect, getUserReservations);
router.route('/:id').put(protect,validateReservationUpdate, updateReservation).delete(protect, authorize('admin'), cancelReservation);//que l'admin qui peut supprimer les reservations

module.exports = router;
