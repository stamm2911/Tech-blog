const router = require("express").Router();
const User = require("../../models/User");

// --------------------- SIGN UP ---------------------
router.post("/", async (req, res) => {
  try {
    await User.create(req.body);
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ["id"],
    });
    UserData = dbUserData.get({ plain: true });
    console.log(UserData.id);

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.userId = UserData.id;
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// --------------------- SIGN IN ---------------------
router.post("/login", async (req, res) => {
  try {
    console.log('req.body',req.body);
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!dbUserData) {
      res.status(401).json({
        message: "Incorrect email or password, please try again",
      });
      return;
    }
    UserData = dbUserData.get({ plain: true });
    console.log(UserData);
    console.log(req.body.password);

    const validPassword = await dbUserData.checkPassword(req.body.password);
    console.log("validPasword:", validPassword);

    if (!validPassword) {
      res.status(401).json({
        message: "Incorrect email or password, please try again",
      });
      return;
    }
    console.log("after");

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.userId = UserData.id;
      console.log(req.session);
      res.status(200).json({
        message: "You are logged in!",
      });
    });
  } catch (err) {
    res.status(401).json(err);
  }
});

// --------------------- LOG OUT ---------------------
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(200).end();
    });
  } else {
    res.status(400).end();
  }
});

module.exports = router;
