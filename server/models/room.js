const mongoose = require('mongoose')
const roomSchema = new mongoose.Schema({
    name:String,
    price:Number,
    booked:Boolean,
    size:String
})

module.exports = mongoose.model('Room',roomSchema)