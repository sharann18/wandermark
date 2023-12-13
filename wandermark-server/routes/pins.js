const router = require('express').Router();
const Pin = require('../models/Pin');

//creating a pin
router.post('/', async (req,res) => {
    const newPin = new Pin(req.body);
    try {
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    } catch(err) {
        res.status(500).json('internal server error'); //internal server error
    }
});

//getting all pins
router.get('/', async (req,res) => {
    try {
        const allPins = await Pin.find();
        res.status(200).json(allPins);
    } catch(err) {
        res.status(500).json('internal server error');
    }
});

router.delete('/:_id', async (req, res) => {
    try {
        const deletedPin = await Pin.findByIdAndDelete(req.params._id);
        if (deletedPin) {
            res.status(200).json({ message: 'Pin deleted successfully' });
        } else {
            res.status(404).json({ message: 'Pin not found' });
        }
    } catch (err) {
        res.status(500).json('Internal server error');
    }
});

module.exports = router;