const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String, 
        required: true
    }
    
    // username and password (salt, hash) will be provided by passport-local-mongoose
}, {
    timestamps: true
})
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)
