const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
exports.protect = async (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Make sure token exists
    if (!token) {
      return res.status(401).json({
          success:false,
          error: "Not authoirize to access this route"
      })
    }
  
    try {
      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
  
      next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            error: "Not authoirize to access this route"
        })
  
    }
  };