const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const verifyToken = require('../middleware/auth');

//[GET] /api/auth
// check if use logged in
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: 'User not found' });

        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Interval server error',
        });
    }
});

//[POST] /api/auth/register - access: public
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    //simple validate
    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Missing username or password' });

    try {
        //check for existing user
        const user = await User.findOne({ username });

        if (user)
            return res
                .status(400)
                .json({ success: false, message: 'Username already taken' });

        // all good
        const hashPassword = await argon2.hash(password);
        const newUser = new User({ username, password: hashPassword });
        await newUser.save();

        // return token
        const accessToken = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({
            success: true,
            message: 'User created successfully',
            accessToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// [POST] /api/auth/login - access: public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    //simple validation
    if (!username || !password)
        return res.status(400).json({
            success: true,
            message: 'Missing username or password!!!',
        });

    try {
        // check for existing user
        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({
                success: false,
                message: 'Incorrect username or password',
            });

        // Username found
        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid)
            return res.status(400).json({
                success: false,
                message: 'Incorrect username or password',
            });

        // all good
        // return token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({ success: true, mesage: 'Login successfully', accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Incorrect server error!',
        });
    }
});

module.exports = router;
