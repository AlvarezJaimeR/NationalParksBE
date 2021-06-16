const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: {type: Date, default:Date.now},
  parkName : {type: String, },
  rating : {type: String, required:true}
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    text: Joi.string().required(),
    parkName: Joi.string(),
    rating: Joi.string().required()
  });
  return schema.validate(post);
}

exports.Post = Post;
exports.validatePost = validatePost;
exports.postSchema = postSchema;
