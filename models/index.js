const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Post_Comment = require('./Post_Comment');

User.hasMany(Post,{
    foreignKey: 'user_id',
});

Post.belongsTo(User,{
    foreignKey: 'user_id',
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
})

Comment.belongsTo(User, {
    foreignKey: 'user_id',
})

//----------------------
Post.hasMany(Post_Comment, {
    foreignKey: 'post_id',
});

Post_Comment.belongsTo(Post, {
    foreignKey: 'post_id',
});

//----------------------
Comment.hasMany(Post_Comment, {
    foreignKey: 'comment_id',
});

Post_Comment.belongsTo(Comment, {
    foreignKey: 'comment_id',
});

module.exports = {User, Post, Comment, Post_Comment};