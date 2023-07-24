//Model of the user data what user will store in is database.
const mongoose = require('mongoose');

const { Schema } = mongoose; 

const NotesSchema = new Schema({
    //associating the user with its database. Only authorized user can view its schema 

    user:{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
        default: "General",
    },
    date:{
    type: Date,
    default: Date.now
    },
});
module.exports = mongoose.model('notes', NotesSchema);