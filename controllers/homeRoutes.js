const router = require("express").Router();
const { User, Post, Comment, Post_Comment } = require("../models");

// --------------------- GET LOGIN ---------------------
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    try {
      res.render("signIn");
    } catch (err) {
      res.status(400).json(err);
    }
  }
});

// --------------------- GET SIGN UP ---------------------
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    try {
      res.render("signUp");
    } catch (err) {
      res.status(400).json(err);
    }
  }
});

// --------------------- GET HOMEPAGE ---------------------
router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      order: [["updatedAt", "DESC"]],
      attributes: {
        exclude: ["user_id", "createdAt"],
      },
      include: [
        {
          model: Post_Comment,
          attributes: {
            exclude: ["post_id", "comment_id"],
          },
          include: [
            {
              model: Comment,
              attributes: {
                exclude: ["id", "post_id", "user_id", "createdAt"],
              },
              include: [
                {
                  model: User,
                  attributes: {
                    exclude: ["id", "email", "password"],
                  },
                },
              ],
            },
          ],
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    const PostData = dbPostData.map((post) => post.get({ plain: true }));
    res.render("home", { PostData, loggedIn: req.session.loggedIn });
  } catch (err) {
    res.status(404).json(err);
  }
});

// --------------------- GET DASHBOARD ---------------------
router.get("/dashboard", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      const dbdashboardData = await Post.findAll({
        order: [["updatedAt", "DESC"]],
        where: {
          user_id: req.session.userId,
        },
        attributes: ["id", "title", "updatedAt"],
      });
      const dashboardData = dbdashboardData.map((title) =>
        title.get({ plain: true })
      );
      const dbUserData = await User.findByPk(req.session.userId);
      const userData = dbUserData.get({ plain: true });
      res.render("dashboard", {
        dashboardData,
        userData,
        loggedIn: req.session.loggedIn,
      });
    } catch (err) {
      res.status(400).json;
    }
  }
});

// --------------------- NEW POST ---------------------
router.get("/newpost", (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      res.render('newPost',{loggedIn: req.session.loggedIn})
    } catch (err) {
      res.status(401).json(err);
    }
  }
});

// --------------------- EDIT POST ---------------------
router.get("/editpost/:id", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      console.log(req.params.id)
      const dbPostData = await Post.findByPk(req.params.id)
      const PostData = dbPostData.get({plain:true})     
      res.render('editPost',{PostData, loggedIn: req.session.loggedIn})
    } catch (err) {
      res.status(401).json(err);
    }
  }
});

module.exports = router;
