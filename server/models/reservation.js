const mongoose = require('mongoose')
const reservationSchema = new mongoose.Schema({
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['confirmed','pending','cancelled'],
        default:'pending'
    }
})

module.exports = mongoose.model('Reservation',reservationSchema)