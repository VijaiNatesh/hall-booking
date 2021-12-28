var ObjectId = require('mongodb').ObjectID
const express = require('express')
const userRoute = express.Router()
const User = require("../models/User")

userRoute.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.json(user)
})

userRoute.get('/booking/:id', async (req, res) => {
    try{
        const user = await User.aggregate([
            {
                $match: {
                    _id: new ObjectId(req.params.id)
                }
            },
            {
                $lookup: {
                    from: "bookings",
                    localField: "_id",
                    foreignField: "customerName",
                    as: "booking"
                }
            },
            {
                $unwind: "$booking"
            },
            {
                $addFields: {
                    "date": "$booking.date",
                    "startTime": "$booking.startTime",
                    "endTime": "$booking.endTime",
                    "roomId": "$booking.roomId"
                }
            },
            {
                $lookup: {
                    from: "rooms",
                    localField: "roomId",
                    foreignField : "_id",
                    as: "room"
                }
            },
            {
                $unwind: "$room"
            },
            {
                $addFields: {
                    "roomName" : "$room.roomName"
                }
            }, 
            {
                $project: {
                    name: 1,
                    roomName: 1,
                    date: 1,
                    startTime: 1,
                    endTime: 1
                }
            }
        ])
        res.json(user)
    }
    catch(error){
        console.log(error)
    }
    
})




module.exports = userRoute