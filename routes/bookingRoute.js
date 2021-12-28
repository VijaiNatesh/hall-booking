const express = require("express")
const bookingRoute = express.Router();
const Booking = require("../models/Booking")
const Room = require("../models/Room")

bookingRoute.post("/", async(req,res) => {
    const booking = await Booking.create(req.body)   
    res.json(booking)
})


module.exports = bookingRoute