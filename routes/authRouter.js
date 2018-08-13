const express = require("express")
const { check, validationResult } = require('express-validator/check')

const User = require("../models/User")

// Set up the router and the authentication routes
const authRouter = express.Router()

// Signup route
authRouter.post("/signup", [
    // Validate the req.body parameters
    check("email").isEmail(),
    check("firstName").isAlphanumeric(),
    check("lastName").isAlphanumeric(),
    check("password").isLength({ min: 8 })
], (req, res, next) => {
    // Check if there were any validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty) {
        return res.status(422).json({ errors: errors.array() })
    }

    // Otherwise, register the new user
    User.register({
        username: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }, req.body.password, (err, user) => {
        if (err) {
            return res.status(err.status).json({ error: err })
        }

        // Authenticate user
        
    })
})

// Login route
authRouter.post("/login", (req, res, next) => {

})