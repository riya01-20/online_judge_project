const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Riya123';

// ROUTE 1: Create a user using POST "api/auth/createuser". No login required.
router.post('/createuser',
    [
    body('name', 'Enter a valid name.').isLength({ min: 3 }),
    body('email', 'Enter a valid Email.').isEmail(),
    body('password', 'Password must be of at least 5 Characters.').isLength({min: 5,}),
    ],
    async (req, res) => {
    // If there are errors, return bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the user with this email already exists.
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
        return res
            .status(400)
            .json({ error: 'Sorry, a user with this email already exists' });
        }

      // Create a new user.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        });
        const data = {
            user:{
                id: user.id
            }
        }
        //generating a token for user
        const authToken = jwt.sign(data , JWT_SECRET);
        // res.json({ user });
        res.json({ authToken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Some error occurred');
    }
    }
);

// ROute 2: Authenticate a user using POST "api/auth/login". No login required.
router.post('/login',
    [
    body('email', 'Enter a valid Email.').isEmail(),
    body('password', 'Password cannot be blank').exists(),
    ],
    async (req, res) => {
    // If there are errors, return bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email , password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Invalid email or password"});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Invalid email or password"});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data , JWT_SECRET);
        res.json({ authToken });

    }catch(error){
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// ROUTE 3: Get logged in User details using POST "api/auth/getuser". No login required.
router.post('/getuser', fetchuser,  async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router; 