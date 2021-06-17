const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const express = require("express");
const { Park } = require("../models/park");
const router = express.Router();

//get all users
router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      return res.send(users);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//get a user
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      return res.send(user);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//register new User
router.post("/", async (req, res) => {
    try {
      const { error } = validateUser(req.body);
      if (error) return res.status(400).send(error.details[0].message);
  
      let user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).send("User already registered");
  
      const salt = await bcrypt.genSalt(10);
  
      user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt),
        icon: req.body.icon
      });
  
      await user.save();
  
      const { password, ...sendUser } = user._doc;
  
      const token = user.generateAuthToken();
  
      return res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(sendUser);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//put -- update a user's credentials
router.put("/:userId", auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);
  
      if (req.body.firstName != null) {
        user.firstName = req.body.firstName;
      }
      if (req.body.lastName != null) {
        user.lastName = req.body.lastName;
      }
  
      await user.save();
      return res.send(user);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//add wishlist parks
router.put("/:userId/wishlist", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

        console.log(req.body);
        const park = new Park({
            text: req.body.text
          });
        console.log(park);

        user.wishListParks.push(park);

        await user.save();
        return res.send(user);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//get all wishlist parks
router.get("/:id/wishParks", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(400).send(`The user id ${req.params.id} does not exist.`);
  
      return res.send(user.wishListParks);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//remove wishlist park
router.put("/:userId/:wishId", auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId);
        if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

        const filteredWish = user.wishListParks.filter((park) => park.text != req.params.wishId);
        user.wishListParks = filteredWish;
        console.log(filteredWish);
        console.log('wishlist parks', user.wishListParks);

        await user.save();
        return res.send(user);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//add visited parks
router.put("/:userId/visited", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

        console.log(req.body);
        const park = new Park({
            text: req.body.text
          });
        console.log(park);

        user.visitedParks.push(park);

        await user.save();
        return res.send(user);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//delete user
router.delete("/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
  
      if (!user) return res.status(400).send(`The user id "${req.params.id}" does not exist.`);
  
      return res.send(user);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

module.exports = router;