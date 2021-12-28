require('dotenv').config()
require('./config/dbConnect')();
const express = require("express")
const app = express()
const roomRoute = require('./routes/roomRoute')
const userRoute = require('./routes/userRoute')
const bookingRoute = require('./routes/bookingRoute')


app.use(express.json())
app.use("/api/room", roomRoute)
app.use("/api/user", userRoute)
app.use("/api/booking", bookingRoute)




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})