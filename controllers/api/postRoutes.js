const router = require("express").Router();
const Post = require("../../models/Post");

// --------------------- GET A POST ---------------------
router.get("/:id", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      const dbPostData = await Post.findOne({
        where: {
          id: req.params.id,
        },
        attributes: ["title", "content"],
      });
      res.status(200).json(dbPostData);
    } catch (err) {
      res.status(401).json(err);
    };
  };
});

// --------------------- NEW POST ---------------------
router.post("/", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      const reqBody = req.body;
      reqBody.user_id = req.session.userId;
      const dbPostData = await Post.create(reqBody);
      res.status(200).json(dbPostData);
    } catch (err) {
      res.status(400).json(err);
    }
  }
});

// --------------------- UPDATE POST ---------------------
router.put("/update", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      console.log(req.body);
      const dbPostData = await Post.update(req.body, {
        where: {
          id: req.body.id,
        },
      });
      if (!dbPostData[0]) {
        res.status(404).json({ message: "No post with this id!" });
        return;
      }
      res.status(200).json(dbPostData);
    } catch (err) {
      res.status(400).json(err);
    }
  }
});

// --------------------- DELETE POST ---------------------
router.delete("/delete", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      console.log(req.body);
      const dbPostData = await Post.destroy({
        where: {
          id: req.body.id,
        },
      });
      if (!dbPostData) {
        res.status(404).json({ message: "No post with this id!" });
        return;
      }
      res.status(200).json(dbPostData);
    } catch (err) {
      res.status(400).json(err);
    }
  }
});

module.exports = router;
