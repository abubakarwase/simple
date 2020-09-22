const express = require("express");
const { createUser , getUser, updateUser, deleteUser} = require("../controllers/users");
  
const router = express.Router({ mergeParams: true });

// authentication middleware
const { protect } = require("../middlewares/auth");

// all of our routes now use these two middlewares
router.use(protect);

router.route("/").post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);


module.exports = router;