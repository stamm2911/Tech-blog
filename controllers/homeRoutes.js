const router = require("express").Router();
const { User, Post, Comment, Post_Comment } = require("../models");

// --------------------- GET POSTS WITH COMMENTS---------------------
router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      order: [["updatedAt", "DESC"]],
      attributes: {
        exclude: ["id", "user_id", "createdAt"],
      },
      include: [
        {
          model: Post_Comment,
          attributes: {
            exclude: [ "post_id", "comment_id"],
          },
          include: [
            {
              model: Comment,
              attributes: {
                exclude: [ "id", "post_id", "user_id", "createdAt"],
              },
              include: [
                {
                  model: User,
                  attributes: {
                    exclude: [ "id", "email", "password"],
                  },
                },
              ],
            },
          ],
          //   attributes: ["comment_id"],
        },
      ],
    });
    const PostData = dbPostData.map((post) => post.get({ plain: true }));
    res.status(201).json(PostData);
  } catch (err) {
    res.status(404).json(err);
  }
});

// --------------------- GET DASHBOARD ---------------------

module.exports = router;