// Zod schema of user
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{type:String, required: true},
    email:{type:String, required: true},
    password:{type:String, required: true},
    role:{type:String, default: 'user'},
    isLoginAllowed: {type: Boolean, default:true},
});

const User = mongoose.model("User", userSchema);

module.exports = { User };