const Reservation = require('../models/reservation'); 

exports.checkRoomAvailability = async function checkRoomAvailability(roomId, startDate, endDate) {
    // Rechercher des réservations existantes qui se chevauchent avec les dates demandées
    const overlappingReservations = await Reservation.find({
        room: roomId,
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
        status: { $ne: 'cancelled' } // ignorer les reservations annulées
    });

    // Si aucune réservation chevauchante n'est trouvée, la chambre est disponible
    return overlappingReservations.length === 0;//qui retourne true s'il nya aucune reservation sur cette periode ou false
}