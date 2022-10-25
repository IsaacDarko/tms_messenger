//require all needed external resources
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
//required inputs for this model are: fullname, password, index_num 
//set up schema using mongoose schema method
const UsersSchema = new Schema({
    username: {
        type: String,
        required: false
    },
    userid: {
        type: String,
        required: false,
        unique: true
    },
    fullname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    last_seen: {
        type: Date,
        required: false
    },
    loggedin: {
        type: Boolean,
        required: false
    },
    level: {
        type: String,
        required: false
    },
    faculty: {
        type: String,
        required: false
    },
    session: {
        type: String,
        required: false
    },
    index_num: {
        type: String,
        required: true
    },
    completion_year: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    }
});

//declare module exports and create collection
module.exports = Users = Mongoose.model('users', UsersSchema);