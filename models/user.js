const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const { Post } = require("./post");
const { Park } = require("./park");

const userSchema = new mongoose.Schema({
    email: { type: String, require: true, minlength: 2, maxlength: 255 },
    password: { type: String, require: true, minlength: 3, maxlength: 1024 },
    firstName: { type: String, require: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, require: true, minlength: 2, maxlength: 50 },
    posts: [Post.schema],
    icon: {type: String},
    wishListParks: [Park.schema],
    visitedParks: [Park.schema]
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
      {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        posts: this.posts,
        icon: this.icon,
        wishListParks: this.wishListParks,
        visitedParks: this.visitedParks
      },
      config.get("jwtSecret")
    );
  };
  
  const User = mongoose.model("User", userSchema);
  
  function validateUser(user) {
    const schema = Joi.object({
      email: Joi.string().min(2).max(255).required().email(),
      password: Joi.string().min(3).max(1024).required(),
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      icon: Joi.string()
    });
    return schema.validate(user);
  }
  
  exports.User = User;
  exports.validateUser = validateUser;
  exports.userSchema = userSchema;