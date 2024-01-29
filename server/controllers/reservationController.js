const Reservation = require('../models/reservation');
const Room = require('../models/room');
const User = require('../models/user');
const {checkRoomAvailability} = require('../services/reservationService')

//creation d'une reservation
exports.createReservation = async (req, res) => {
    try {
        //le status qui nest pas là car sa valeur par defaut lors de la
        //creation d'une reservation est à pending
        const { room, user, startDate, endDate } = req.body;
        const userId = req.user.id;

        //verifier la disponibilité de la chambre
        const isRoomAvailable = await checkRoomAvailability(room, startDate, endDate);
        //si la chambre n'est pas disponible,renvoyer un message de non disponibilité
        if(!isRoomAvailable){
            return res.status(400).json({success:false,message:'Room is not available'})
        }

        const newReservation = await Reservation.create({
            room,
            user:userId,
            startDate,
            endDate
        });

        res.status(201).json({ success: true, data: newReservation });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

//recuperation des reservations d'un utilisateur
exports.getUserReservations = async (req, res) => {
    try {
        const userId = req.user.id;

        const reservations = await Reservation.find({ user: userId });

        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


//modifier une reservation
exports.updateReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;
        const userId = req.user.id; // ID de l'utilisateur authentifié
        const { startDate, endDate,room } = req.body; // Extrait les nouvelles dates et la chambre

        const reservation = await Reservation.findById(reservationId); //recuperation de la reservation concerné par le update
        //si la reservation n'existe pas
        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        //si vous n'etes pas admin,ou que ce nest pas vous qui avez crée cette reservation,vous ne pouvez pas la modifier
        if (reservation.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this reservation' });
        }

        //verifier la disponibilité de la chambre en fonction des dates
        if ((startDate && startDate !== reservation.startDate.toString()) || 
            (endDate && endDate !== reservation.endDate.toString())) {
            const roomToCheck = room || reservation.room;
            const isAvailable = await checkRoomAvailability(roomToCheck || reservation.room, startDate || reservation.startDate, endDate || reservation.endDate);
            if (!isAvailable) {
                return res.status(400).json({ success: false, message: 'Room is not available for the selected dates' });
            }
        }

        //mettre à jour la reservation
        if (startDate) reservation.startDate = startDate;
        if (endDate) reservation.endDate = endDate;

        await reservation.save();
        res.status(200).json({ success: true, data: reservation });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

//annuler une reservation
exports.cancelReservation = async (req, res) => {
    try {
        //recuperation de l'id de la reservation à supprimer et l'id de lutilisateur authentifié
        const reservationId = req.params.id;
        const userId = req.user.id;

        //s'assurer que ça correspond à une reservation dans notre base de données
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        // Vérifier si l'utilisateur a le droit d'annuler cette réservation
        if (reservation.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this reservation' });
        }
        //changer le status de la reservation et le mettre à jour dans la base de données
        reservation.status = 'cancelled';
        await reservation.save();

        res.status(200).json({ success: true, data: reservation });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

