const express = require("express")
const morgan = require("morgan")
const http = require("http")
const mongoose = require("mongoose")
const passport = require("passport")

const config = require("./config")

// Connect to the database
const connect = mongoose.connect(config.dbUrl)
connect.then((db) => {
    console.log("Connected to the database.")
}).catch((err) => console.log(err))

// Set up the server
const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(passport.initialize())

// Unauthenticated routes
const authRouter = require("./routes/authRouter")
app.use("/auth", authRouter)

// Authenticated routes

// Start the server
const server = http.createServer(app)
server.listen(config.port, config.host, () => {
    console.log(`Server running on ${config.host}:${config.port}.`)
})