const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../schemas/userSchema');

// create model
const User = new mongoose.model('User', userSchema);

// sign up new user
router.get('/signup', async (req, res) => {
    try {
        const encryptedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: encryptedPassword,
        });
        await newUser.save();
        res.status(200).json({ message: 'User was saved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'There was a server side error!' });
    }
});

// login user

router.get('/login', async (req, res) => {
    try {
        const user = await User.find({ username: req.body.username });

        if (user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if (isValidPassword) {
                // generate Token
                const token = jwt.sign(
                    {
                        username: user[0].username,
                        userId: user[0]._id,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1h',
                    }
                );

                res.status(200).json({
                    access_token: token,
                    message: 'Login Successfull',
                });
            } else {
                res.status(401).json({ error: 'Authentication failed!' });
            }
        } else {
            res.status(401).json({ error: 'Authentication failed!' });
        }
    } catch (err) {
        res.status(500).json({ error: 'There was a server side error!' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const users = await User.find({}).populate('todos');
        res.status(200).json({
            data: users,
            message: 'Successfull',
        });
    } catch (err) {
        res.status(500).json({ error: 'There was a server side error!' });
    }
});

// export the router
module.exports = router;
