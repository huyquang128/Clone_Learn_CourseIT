const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const verifyToken = require('../middleware/auth');

//[GET] /api/auth/post
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', [
            'username',
        ]);
        res.json({ success: true, posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Incorrect server error!!!',
        });
    }
});

//[POST] /api/auth/post
router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;

    // simple validation
    if (!title)
        return res
            .status(400)
            .json({ success: false, message: 'Title is require!!!' });

    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId,
        });

        await newPost.save();

        res.json({ success: true, message: 'Happy learning!', post: newPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Incorrect server error!',
        });
    }
});

// [PUT] /api/posts
router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;

    //simple validate
    if (!title)
        return res
            .status(400)
            .json({ success: false, message: 'Title is require!!!' });

    try {
        let updatedPost = {
            title,
            description: description || '',
            url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            status: status || 'TO LEARN',
        };

        const postUpdateCondition = { _id: req.params.id, user: req.userId };

        updatedPost = await Post.findOneAndUpdate(
            postUpdateCondition,
            updatedPost,
            { new: true }
        );
        if (!updatedPost)
            return res.status(401).json({
                success: false,
                message: 'Post not found or user not authorised',
            });

        res.json({
            success: true,
            message: 'Excellent progess!',
            post: updatedPost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// [DELETE] /api/posts
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id, user: req.userId };
        const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

        if (!deletedPost)
            return res.status(400).json({
                success: false,
                message: 'Post not found or user not authorized',
            });

        res.json({ success: true, post: deletedPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

module.exports = router;
