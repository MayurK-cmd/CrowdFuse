// Zod schema of user
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{type:String, required: true},
    lastName:{type:String, required: true},
    email:{type:String, required: true},
    password:{type:String, required: true},
    city:{type:String, required: true},
    contactNumber:{type:String, required: true},
    role:{type:String, default: 'user'},
    isLoginAllowed: {type: Boolean, default:true},
});

const User = mongoose.model("User", userSchema);

module.exports = { User };