const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.status(200).json({
        message: "You are logged in!",
        name: req.user.firstName + " " + req.user.lastName
    })
})

module.exports = router