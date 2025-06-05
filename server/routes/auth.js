const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// Register form
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/register', {
                error: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        req.session.userId = user._id;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

// Login form
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/login', {
                error: 'Invalid email or password'
            });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.render('auth/login', {
                error: 'Invalid email or password'
            });
        }

        req.session.userId = user._id;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

// Logout
router.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).render('error', { error: err });
        }
        res.redirect('/');
    });
});

module.exports = router; 