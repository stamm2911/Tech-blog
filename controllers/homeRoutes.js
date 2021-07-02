const router = require("express").Router();
const { User, Post, Comment, Post_Comment } = require("../models");

// --------------------- GET LOGIN ---------------------
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    try {
      // res.status(200).send("LOGIN");
      res.render('signIn');
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
      // res.status(200).send("SIGN UP");
      res.render('signUp');
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
          attributes: ['name']
        }
      ],
    });
    const PostData = dbPostData.map((post) => post.get({ plain: true }));
    // res.status(200).json(PostData);
    res.render('home',{PostData, loggedIn: req.session.loggedIn});
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
      // res.status(200).json(dashboardData);
      res.render('dashboard',{dashboardData, loggedIn: req.session.loggedIn});
    } catch (err) {
      res.status(400).json;
    }
  }
});

module.exports = router;