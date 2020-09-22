const User = require("../models/User");

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
    
        const user = await User.create({
            name,
            email,
            password,
        });
    
        sendTokenResponse(user, 200, res);
        
    } catch (error) {
        return res.status(500).json({success:false, error})
    }
};

// login
exports.login = async (req, res, next) => {
    try {
        
        const { email, password } = req.body;
    
        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success:false, 
                message:"Please provide an eamil and password"
            })
        }
    
        // Check for the user
        const user = await User.findOne({ email }).select("+password");
    
        if (!user) {
            return res.status(401).json({
                success:false, 
                message:"Invalid credentials"
            })
        }
        // check if password matches
        const isMatch = await user.matchPassword(password);
    
        if (!isMatch) {
            return res.status(401).json({
                success:false, 
                message:"Invalid credentials"
            })
        }
    
        sendTokenResponse(user, 200, res);
    } catch (error) {
        return res.status(500).json({
            success:false, 
            message:error.message
        })
    }
};


// get token from the model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();
  
    res
      .status(statusCode)
      .json({ success: true, token });
  };
  