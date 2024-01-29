/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: API endpoints for managing rooms
 */

//Requête HTTP -> Route -> Middleware(s) -> Contrôleur -> Base de Données (si nécessaire) -> Contrôleur -> Réponse HTTP


const express = require('express');

//Joi est une bibliotheque qui nous permet de s'assurer que les données entrantes respectent un format attendu,sont sures et fiables
const Joi = require('joi')
const router = express.Router();
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');

//Schema joi pour la validation du format des données entrantes
const roomSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    booked: Joi.boolean().required(),
    size: Joi.string().required()
    
})


//Middleware pour valider les données de la chambre
const validateRoom = (req,res,next) => {
    //destructuration car la methode validate nous renvoie un objet qui contient deux propriétes principales:error et  value
    //on recupere error et on affiche les details
    const { error } = roomSchema.validate(req.body);
    if(error) {
        return res.status(400).send(error.details);
    }
    next();
}

/**
 * @swagger
 * path:
 *   /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       '200':
 *         description: Successfully retrieved rooms
 *       '500':
 *         description: Internal server error.
 */
router.get('/', getRooms);
/**
 * @swagger
 * path:
 *   /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               booked:
 *                 type: boolean
 *               size:
 *                 type: string
 *             required:
 *               - name
 *               - price
 *               - booked
 *               - size
 *     responses:
 *       '201':
 *         description: A new room has been created
 *       '400':
 *         description: Bad request. Validation error or missing required fields.
 *       '500':
 *         description: Internal server error.
 */
router.post('/', validateRoom, createRoom);

/**
 * @swagger
 * path:
 *   /api/rooms/{id}:
 *   put:
 *     summary: Update a room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the room to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               booked:
 *                 type: boolean
 *               size:
 *                 type: string
 *             required:
 *               - name
 *               - price
 *               - booked
 *               - size
 *     responses:
 *       '200':
 *         description: Room updated successfully
 *       '400':
 *         description: Bad request. Validation error or missing required fields.
 *       '404':
 *         description: Room not found.
 *       '500':
 *         description: Internal server error.
 */
router.put('/:id', validateRoom, updateRoom);


/**
 * @swagger
 * path:
 *   /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the room to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Room deleted successfully
 *       '404':
 *         description: Room not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:id', deleteRoom);

module.exports = router;

