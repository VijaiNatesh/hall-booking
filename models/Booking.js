var ObjectId = require('mongodb').ObjectID
const mongoose = require("mongoose")
const conn = mongoose.createConnection(process.env.MONGO_URL)
const Room = require("../models/Room")


const BookingSchema = new mongoose.Schema({
    customerName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        default: Date
    },
    startTime: {
        type: Number,
        min: 0,
        max: 23.59,
        required: true
    },
    endTime: {
        type: Number,
        min: 0,
        max: 23.59,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    }

})

BookingSchema.path('date').validate(async function (value) {
    let roomId = this.roomId;
    let newStartTime = this.startTime;
    let newEndTime = this.endTime;
    let newDate = this.date;

    let clashesWithExisting = (existingStartTime, existingEndTime, newStartTime, newEndTime, existingDate, newDate) => {
        if (newDate === existingDate) {
            if ((newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
                (existingStartTime >= newStartTime && existingStartTime < newEndTime)) {

                throw new Error('Booking could not be saved. There is a clash with an existing booking')
            }
        }
        return false
    }
    const room = await Room.aggregate([
        {
            $match: {
                _id: new ObjectId(roomId)
            }
        },
        {
            $lookup: {
                from: "bookings",
                localField: "_id",
                foreignField: "roomId",
                as: "booking"
            }
        },
        { $unwind: "$booking" },
        {
            $project: {
                booking: 1
            }
        }
    ])


    if (room.length === 0) {
        console.log("Zero")
    }
    else {
        return room.forEach(booking => {
            let existingStartTime = booking.booking.startTime;           
            let existingEndTime = booking.booking.endTime;
            let existingDate = booking.booking.date;
            console.log(existingDate)

            return !clashesWithExisting(
                existingStartTime,
                existingEndTime,
                newStartTime,
                newEndTime,
                existingDate,
                newDate
            )
        })
      

    }

})

const Booking = conn.model("Booking", BookingSchema)
module.exports = Booking