const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    description: {
      type: String,
      required: [true, "Please add description"],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports = mongoose.model("Post", PostSchema);
