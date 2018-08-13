const express = require("express")
const passport = require("passport")
const { check, validationResult } = require('express-validator/check')

const authenticate = require("../utils/authenticate")
const User = require("../models/User")

// Set up the router and the authentication routes
const authRouter = express.Router()

// Request handler to generate and issue JWT token
const issueToken = function (req, res) {
    const token = authenticate.getTokenForUser(req.user)
    res.status(200).json({
        token: token,

        // Don't return all the fields (hash, salt, etc.)
        user: {
            email: req.user.username,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
        }
    })
}

// Signup (and then login) route
authRouter.post("/signup", [
    // Validate the req.body parameters
    check("email").isEmail(),
    check("firstName").isAlphanumeric(),
    check("lastName").isAlphanumeric(),
    check("password").isLength({ min: 8 }),

    // Create the user
    function (req, res, next) {
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
            if (err) return next(err)
            
            // Login
            req.login(user, { session: false }, function(err) {
                if (err) return next(err)
                next()
            })
        })
    },
    issueToken
])

// Login route
authRouter.post("/login", [
    // Validate the req.body parameters
    check("email").isEmail(),
    check("password").isString(),

    // Login with username/email and password
    passport.authenticate("local", { session: false }),
    issueToken
])

// Logout route
authRouter.get("/logout", function(req, res) {
    req.logout()
    res.status(200).json({ success: true })
})

module.exports = authRouter