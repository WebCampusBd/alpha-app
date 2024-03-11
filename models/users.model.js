const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    googleId : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
})

const User = mongoose.model("users", userSchema);


const normalSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
})

const Normal = mongoose.model("normals", normalSchema);




module.exports = {User, Normal};