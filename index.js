const express = require("express")
const morgan = require("morgan")
const http = require("http")
const mongoose = require("mongoose")
const passport = require("passport")
const bodyParser = require("body-parser")

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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use("*", (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    return next()
})

// Unauthenticated routes
const authRouter = require("./routes/authRouter")
app.use("/auth", authRouter)

// Authenticated routes
const auth = passport.authenticate('jwt', { session : false })
const indexRouter = require("./routes/indexRouter")
app.use("/", auth, indexRouter)

// Handle errors
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
       .json({ error: err })
})

// Start the server
const server = http.createServer(app)
server.listen(config.port, config.host, () => {
    console.log(`Server running on ${config.host}:${config.port}.`)
})