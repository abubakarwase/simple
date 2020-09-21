const User = require("../models/User");

exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
  };

  
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({ success: true, data: user });

    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};
  
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        
        res.status(200).json({ success: true, data: user });
        
    } catch (error) {
        res.status(500).json({ success: false, error });
        
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ success: true, data: {} });
        
    } catch (error) {
        res.status(500).json({ success: false, error });
        
    }
};