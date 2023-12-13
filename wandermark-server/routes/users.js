const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//registering a new user
router.post('/register', async (req,res) => {
    try{
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(200).json(savedUser._id);

    } catch(err) {
        res.status(500).json('internal server error');
    }
});

//logging in an existing user
router.post('/login', async (req,res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        !user && res.status(400).json('Wrong credentials. Please try again!');

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if(!validPassword) {
            res.status(400).json('Wrong credentials. Please try again!');
        } else {
            res.status(200).json({id: user._id, username: user.username});
        }

    } catch(err) {
        res.status(500).json('internal server error');
    }
});

module.exports = router;