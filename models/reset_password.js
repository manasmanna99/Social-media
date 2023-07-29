const mongoose = require('mongoose');


const resetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    // comment belongs to a user
    accessToken: {
        type: String,
        required: true
    },
    expireIn: {
        type: Number,
        required:true
    }
},{
    timestamps: true
});

const Reset = mongoose.model('Reset', resetSchema);
module.exports = Reset;