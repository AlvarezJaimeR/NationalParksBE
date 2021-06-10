const { User } = require("../models/user");
const { Post, validatePost } = require("../models/post");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

//get all posts
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(400).send(`The user id ${req.params.id} does not exist.`);
  
      return res.send(user.posts);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//post a new post
router.post("/:id/post", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(400).send(`The user id "${req.params.id}" does not exist.`);
  
      const { error } = validatePost(req.body);
      if (error) return res.status(400).send(error);
  
      const post = new Post({
        text: req.body.text
      });
  
      user.posts.push(post);
      await user.save();
  
      return res.send(user.posts);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// delete a post
router.put("/:userId/:postId", auth, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId);
      if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);
  
      const filteredPosts = user.posts.filter((post) => post._id != req.params.postId);
      user.posts = filteredPosts;
  
      await user.save();
      return res.send(user);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;