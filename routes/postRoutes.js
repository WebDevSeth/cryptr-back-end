require("dotenv").config;

const express = require("express");
const Post = require("../models/Posts");
const { getPost } = require("../middleware/get");
const authenticateToken = require("../middleware/auth");

const app = express.Router();

// GET all Posts
app.get("/", authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(201).send(posts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET one Post
app.get("/:id", [authenticateToken, getPost], (req, res, next) => {
  res.send(res.post);
});

// CREATE a post
app.post("/", authenticateToken, async (req, res, next) => {
  const { title, category, description, img, price } = req.body;

  let post;

  img
    ? (post = new Post({
        title,
        category,
        description,
        img,
        price,
        created_by: req.user._id,
      }))
    : (post = new Post({
        title,
        category,
        description,
        img,
        price,
        created_by: req.user._id,
      }));

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a post

app.put("/:id", [authenticateToken, getPost], async (req, res, next) => {
  if (req.user._id !== res.post.created_by)
    res.status(400).json({
      message: "You do not have the permission to update this post",
    });
  const { title, category, description, img, price } = req.body;
  if (title) res.post.title = title;
  if (category) res.post.category = category;
  if (description) res.post.description = description;
  if (img) res.post.img = img;
  if (price) res.post.price = price;

  try {
    const updatedPost = await res.post.save();
    res.status(201).send(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a post
app.delete("/:id", [authenticateToken, getPost], async (req, res, next) => {
  if (req.user._id !== res.post.created_by)
    res.status(400).json({
      message: "You do not have the permission to delete this post",
    });
  try {
    await res.post.remove();
    res.json({ message: "Deleted post" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
