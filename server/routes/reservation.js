/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API endpoints for managing reservations
 */
const express = require('express');
const Joi = require('joi');
const { protect, authorize } = require('../middlewares/authMiddleware');
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

/**
 * @swagger
 * path:
 *   /api/reservations/user:
 *     get:
 *       summary: Get reservations for the authenticated user
 *       tags: [Reservations]
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         '200':
 *           description: Successfully retrieved reservations for the authenticated user
 *         '401':
 *           description: Unauthorized. User not authenticated.
 *         '500':
 *           description: Internal server error.
 */
router.route('/user').get(protect, getUserReservations);

/**
 * @swagger
 * path:
 *   /api/reservations:
 *     post:
 *       summary: Create a new reservation
 *       tags: [Reservations]
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   type: string
 *                 user:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *               required:
 *                 - room
 *                 - user
 *                 - startDate
 *                 - endDate
 *       responses:
 *         '201':
 *           description: A new reservation has been created
 *         '400':
 *           description: Bad request. Validation error or missing required fields.
 *         '401':
 *           description: Unauthorized. User not authenticated.
 *         '500':
 *           description: Internal server error.
 */
router.route('/').post(protect, validateReservationCreate, createReservation);

/**
 * @swagger
 * path:
 *   /api/reservations/{id}:
 *     put:
 *       summary: Update a reservation by ID
 *       tags: [Reservations]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the reservation to update
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                 room:
 *                   type: string
 *               required:
 *                 - startDate
 *       responses:
 *         '200':
 *           description: Reservation updated successfully
 *         '400':
 *           description: Bad request. Validation error or missing required fields.
 *         '401':
 *           description: Unauthorized. User not authenticated.
 *         '404':
 *           description: Reservation not found.
 *         '500':
 *           description: Internal server error.
 */
router.route('/:id').put(protect, validateReservationUpdate, updateReservation);
//pour le moment on retire protect

/**
 * @swagger
 * path:
 *   /api/reservations/{id}:
 *     delete:
 *       summary: Cancel a reservation by ID (admin only)
 *       tags: [Reservations]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the reservation to cancel
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Reservation canceled successfully
 *         '401':
 *           description: Unauthorized. User not authenticated as an admin.
 *         '404':
 *           description: Reservation not found.
 *         '500':
 *           description: Internal server error.
 */
router.route('/:id').delete(protect,authorize('admin'), cancelReservation);

module.exports = router;
