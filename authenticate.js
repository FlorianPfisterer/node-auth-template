const passport = require("passport")
const LocalStrategy = require("passport-local").LocalStrategy
const JwtStrategy = require("passport-jwt").JwtStrategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const jwt = require("jsonwebtoken")

const config = require("./config")
const User = require("./models/User")

// Setup se- and deserialization
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Options for the JwtStrategy
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSignSecretKey
}

module.exports = {
    // Create new tokens
    getTokenForUser: (user) => {
        return jwt.sign({ id: user._id }, config.jwtSignSecretKey, {
            expiresIn: config.jwtExpirySeconds
        })
    },

    // Jwt authentication strategy: retrieve user using the id from the jwtPayload
    jwtPassport: passport.use(new JwtStrategy(options, 
        (jwtPayload, done) => {
            User.findOne({ _id: jwtPayload.id })
                .then((user) => {
                    return done(null, user)
                })
                .catch((err) => {
                    return done(err)
                })
        })),

    // Local strategy
    local: passport.use(new LocalStrategy(User.authenticate()))
}