const express = require("express");
const { createUser , getUser, updateUser, deleteUser, getPosts} = require("../controllers/users");
  
const router = express.Router({ mergeParams: true });

// authentication middleware
const { protect } = require("../middlewares/auth");

// all of our routes now use these two middlewares
router.use(protect);

router.route("/").post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/:id/posts").get(getPosts)

module.exports = router;