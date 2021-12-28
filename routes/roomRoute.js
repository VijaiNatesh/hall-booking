
const express = require('express')
const roomRoute = express.Router()
const Room = require('../models/Room')




roomRoute.post('/', async (req, res) => {
    const room = await Room.create(req.body)
    res.json(room)
})

roomRoute.get('/getbooking', async (req, res) => {
    const booking = await Room.aggregate([       
        {
            $lookup: {
                from: "bookings",
                localField: "_id",
                foreignField: "roomId",
                as: "booking"
            }
        },
        {
            $unwind: "$booking"
        },
        {
            $addFields: {
                "customerName": "$booking.customerName",
                "date" : "$booking.date",
                "startTime" : "$booking.startTime",
                "endTime" : "$booking.endTime"
            }

        },
        {
            $lookup: {
                from: "users",
                localField: "customerName",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $addFields: {
                "CustomerName" : "$user.name"
            }
        }, 
        {
            $project: {
                roomName: 1,
                CustomerName: 1,
                date: 1,
                startTime: 1,
                endTime: 1
            }
        }
    ])
    res.json(booking)
    
})





module.exports = roomRoute;



//  {
//     "roomName": "Ooty",
//     "seats" : "5",
//     "amenities" : "A/c, Refrigerator, Swimming Pool",
//     "pricePerHour" : "100",
//     "bookings" : []
// }