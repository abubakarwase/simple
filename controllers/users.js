const User = require("../models/User");
const writeFile = require("../jobs/writeFIle")

// queue.process(1, async (req,res) => {
//     const posts = await User.aggregate([
//         {
//             $lookup: {
//                 from: "posts",
//                 let : {user:"$_id"},
//                 pipeline:[
//                     {
//                         $match: {
//                             $expr: { 
//                                 $eq: [ "$user" , "$$user"]
//                             }
//                         } 
//                     },
//                     {
//                         $sort: { createdAt: -1 }
//                     },
//                 ],
//                 as: "posts"
//             },
//         },
//     ]).exec()
//     res.status(200).json({
//         success: true, data: posts
//      });
// });

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

exports.getPosts = async (req, res, next) => {
    try {
        // const posts = await User.aggregate([
        //     {
        //         $lookup: {
        //             from: "posts",
        //             let : {user:"$_id"},
        //             pipeline:[
        //                 {
        //                     $match: {
        //                         $expr: { 
        //                             $eq: [ "$user" , "$$user"]
        //                         }
        //                     } 
        //                 },
        //                 {
        //                     $sort: { createdAt: -1 }
        //                 },
        //             ],
        //             as: "posts"
        //         },
        //     },
        // ]).exec()
        writeFile.writeFile(req)
        res.status(200).json({
            success: true, data: "File will be generated in a while."
        });
        
    } catch (error) {
        res.status(500).json({ success: false, error:error.message });
        
    }
};