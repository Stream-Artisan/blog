const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Admin dashboard
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.render('admin/dashboard', { posts });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

// Create post form
router.get('/post/new', isAuthenticated, isAdmin, (req, res) => {
    res.render('admin/post-form', { post: {} });
});

// Create post
router.post('/post', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { title, content, status } = req.body;
        const post = new Post({
            title,
            content,
            status,
            author: req.user._id
        });
        await post.save();
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

// Edit post form
router.get('/post/:id/edit', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).render('error', { error: 'Post not found' });
        }
        res.render('admin/post-form', { post });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

// Update post
router.put('/post/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { title, content, status } = req.body;
        await Post.findByIdAndUpdate(req.params.id, {
            title,
            content,
            status
        });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

// Delete post
router.delete('/post/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

module.exports = router; 