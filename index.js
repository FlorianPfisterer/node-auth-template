const express = require("express")
const morgan = require("morgan")
const http = require("http")
const https = require("https")
const fs = require("fs")
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

// Redirect non-https requests
app.all("*", (req, res, next) => {
    if (req.secure) {
        return next()
    } else {
        console.log("insecure");
        
        res.redirect(307, `https://${req.hostname}:${config.securePort}${req.url}`)
    }
})

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

// Start the http server (requests are redirected to secure server)
const server = http.createServer(app)
server.listen(config.port, config.host, () => {
    console.log(`Server running on ${config.host}:${config.port}.`)
})

// Start secure HTTPS server
const options = {
    key: fs.readFileSync(__dirname + "/cert/privatekey.pem"),
    cert: fs.readFileSync(__dirname + "/cert/certificate.pem")
}

const secureServer = https.createServer(options, app)
secureServer.listen(config.securePort, () => {
    console.log(`Secure server running on ${config.host}:${config.securePort}`);  
})
