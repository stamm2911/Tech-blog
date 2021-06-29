// Connect to db
const sequelize = require("../config/connection");
// Import Models/Tables to use them
const { User, Post, Comment, Post_Comment} = require("../models");
// Import seeds to populate the db
const userData = require("./userData.json");
const postData = require("./postData.json");
const commentData = require("./commentData.json");
const post_commentData = require('./post_commentData.json');

const seedDataBase = async () => {
  try {
    await sequelize.sync({ force: true });
    await User.bulkCreate(userData);
    await Post.bulkCreate(postData);
    await Comment.bulkCreate(commentData);
    await Post_Comment.bulkCreate(post_commentData);
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
};

seedDataBase();