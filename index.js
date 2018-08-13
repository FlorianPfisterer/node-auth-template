const express = require("express")
const morgan = require("morgan")
const http = require("http")

const host = "localhost"
const port = 3000

const app = express()
app.use(morgan("dev"))

const server = http.createServer(app)
server.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`)
})