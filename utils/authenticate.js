const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const jwt = require("jsonwebtoken")

const config = require("../config")
const User = require("../models/User")

// Options for the JwtStrategy
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSignSecretKey
}

// Local strategy: email and passwort login
passport.use(User.createStrategy())

// Jwt authentication strategy: retrieve user using the id from the jwtPayload
passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload.id })
        .then((user) => {
            return done(null, user)
        })
        .catch((err) => {
            return done(err)
        })
}))

module.exports = {
    // Create new tokens
    getTokenForUser: (user) => {
        return jwt.sign({ id: user._id }, config.jwtSignSecretKey, {
            expiresIn: config.jwtExpirySeconds
        })
    }
}