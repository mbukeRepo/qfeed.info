const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        required:true,
        type:String
    }
});

module.exports = mongoose.model("User", UserSchema);