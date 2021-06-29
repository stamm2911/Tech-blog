const router = require("express").Router();
const session = require("express-session");
const { User, Post, Comment, Post_Comment } = require("../models");

// --------------------- GET HOMEPAGE ---------------------
router.get("/", async (req, res) => {
//   if (!req.session.loggedIn) {
//     res.redirect("/login");
//   } else {
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
        ],
      });
      const PostData = dbPostData.map((post) => post.get({ plain: true }));
      res.status(201).json(PostData);
    } catch (err) {
      res.status(404).json(err);
    }
//   }
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
      res.status(200).json(dashboardData);
    } catch (err) {
      res.status(400).json;
    }
  }
});

module.exports = router;