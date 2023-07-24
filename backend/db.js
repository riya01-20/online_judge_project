const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test_database')
// const mongoURI ="mongodb+srv://riya01_20:Riya@123@cluster0.9lhebdq.mongodb.net/"
const mongoURI='mongodb://127.0.0.1/test_database';

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Successfully connected to Mongo");
    })
}

module.exports = connectToMongo;