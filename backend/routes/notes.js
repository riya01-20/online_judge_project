//file that will fetch the details of the users if the credentials of the logged in user is correct 

const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE 1; Get all the notes(data) using: GET "/api/auth/getuser" Login required  
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    const notes = await Notes.find({user: req.user.id});
    res.json(notes);
})

//ROUTE 2; Add a new note(data) using POST "/api/auth/addnote" Login required  
router.get('//addnote',fetchuser, async (req,res)=>{
    res.json();
})

 module.exports = router;