const express = require("express");
const { createPost, getPosts, getPost, updatePost, deletePost } = require("../controllers/posts");
  
const router = express.Router({ mergeParams: true });

// authentication middleware
const { protect } = require("../middlewares/auth");

// all of our routes now use these two middlewares
router.use(protect);

router.route("/user/:userId").post(createPost).get(getPosts);
router.route("/:postId").get(getPost).put(updatePost).delete(deletePost);


module.exports = router;