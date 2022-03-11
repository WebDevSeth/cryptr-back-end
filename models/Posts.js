const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  post_id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
    default: "https://picsum.photos/1920",
  },
  price: {
    type: Number,
    required: true,
  },
  created_by: {
    type: String,
  },
});

module.exports = mongoose.model("Post", postSchema);
