const Post = require("../models/Post");
const mongoose = require("mongoose");

exports.createPost = async (req, res, next) => {
    try {
        const { description  } = req.body;
    
        const post = await Post.create({
            description,
            user: req.params.userId
        });
    
        res.status(200).json({
            success: true,
            data: post,
          });
    } catch (error) {
        return res.status(500).json({success:false, error})
    }
};

exports.getPosts = async (req, res, next) => {
    try {    
        // const posts = await Post.find({
        //     user: req.params.userId
        // }).populate('user').exec()
        // const posts = await Post.aggregate([
        //     {
        //         $match: {user : mongoose.Types.ObjectId(req.params.userId)}
        //     },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "user",
        //             foreignField: "_id",
        //             as: "user"
        //         }
        //     }
        // ]).exec()
    
        res.status(200).json({
            success: true,
            data: posts,
          });
    } catch (error) {
        return res.status(500).json({success:false, error})
    }
};

exports.getPost = async (req, res, next) => {
    try {    
        const post = await Post.find({
            _id: req.params.postId
        }).populate('user');
    
        res.status(200).json({
            success: true,
            data: post,
          });
    } catch (error) {
        return res.status(500).json({success:false, error})
    }
};

exports.updatePost = async (req, res, next) => {
    try {    
        const post = await Post.find({
            user: req.params.userId
        }).populate('user');
    
        res.status(200).json({
            success: true,
            data: post,
          });
    } catch (error) {
        return res.status(500).json({success:false, error})
    }
};

exports.deletePost = async (req, res, next) => {
    try {    
        const post = await Post.find({
            user: req.params.userId
        }).populate('user');
    
        res.status(200).json({
            success: true,
            data: post,
          });
    } catch (error) {
        return res.status(500).json({success:false, error})
    }
};