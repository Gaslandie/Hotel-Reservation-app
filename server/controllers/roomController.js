const Room = require('../models/room')
const mongoose = require('mongoose')

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
    const { id } = req.params;
    //verifier si l'ID est un ObjectID mongoDB valide avant d'envoyer
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'Invalid room ID in update request'})
    }
    try {
        //mettre à jour la chambre avec l'id fournit si elle existe
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id,req.body,{new:true})

        //s'assurer que la chambre existe bien,car si la chambre n'existe pas avec l'id fournit updateRoom sera egal à null
        if(!updatedRoom){
            return res.status(404).json({message:'Room not found'});
        }
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