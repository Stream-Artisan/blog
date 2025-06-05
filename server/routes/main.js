const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Home page
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(6);
        res.render('index', { posts });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

// Blog page with pagination
router.get('/blog', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.render('blog', { 
            posts,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

// Single post page
router.get('/post/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (!post) {
            return res.status(404).render('error', { error: 'Post not found' });
        }
        res.render('post', { post });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

// About page
router.get('/about', (req, res) => {
    res.render('about');
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;