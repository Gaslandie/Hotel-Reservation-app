const Room = require('../models/room')

//recuperer toutes les chambres
exports.getRooms = async (req,res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//creer un nouvelle chambre
exports.createRoom = async (req,res) => {
    const room = new Room(req.body)
    try {
        const savedRoom = await room.save()
        res.status(201).json(savedRoom)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

//mettre à jour une chambre

exports.updateRoom = async(req,res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json(updatedRoom)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

//Supprimer une chambre
exports.deleteRoom = async (req,res) => {
    try {
        await Room.findByIdAndDelete(req.params.id)
        res.status(200).json({message:'Room deleted successfully'})
    } catch (error) {
        res.status(500).json({messsage:error.message})
    }
}