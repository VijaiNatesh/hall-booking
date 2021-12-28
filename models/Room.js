const mongoose = require("mongoose")
const conn = mongoose.createConnection(process.env.MONGO_URL)


const RoomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    amenities: {
        type: String,
        required: true
    },
    pricePerHour: {
        type: String,
        required: true
    }   
})

RoomSchema.virtual('booking', {
    ref: "Booking",
    localField: "_id",
    foreignField:"roomId"   
})
RoomSchema.set('toJSON', { virtuals: true });

const Room = conn.model("Room", RoomSchema)

module.exports = Room