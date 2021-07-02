const router = require("express").Router();
const Comment = require("../../models/Comment");
const Post_Comment = require("../../models/Post_Comment");

// --------------------- POST NEW COMMENT ---------------------
router.post("/", async (req, res) => {
  if (!req.session.loggedIn) {
    res.status(400).json({message:'Please sign in'});
  } else {
    try {
      req.body.user_id = req.session.userId;
      await Comment.create(req.body);
      await Post_Comment.create({
        post_id: req.body.post_id,
        comment_id: await Comment.count(),
      });
      res.status(200).json({ message: "comment posted!" });
    } catch (err) {
      res.status(400).json(err);
    }
  }
});

module.exports = router;
