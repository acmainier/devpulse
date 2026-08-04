const User = require("./user");
const Post = require("./post");
const Category = require("./category");
const Comment = require("./comment");

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

Category.hasMany(Post, { foreignKey: "categoryId" });
Post.belongsTo(Category, { foreignKey: "categoryId" });

Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

Comment.hasMany(Comment, {
  as: "replies",
  foreignKey: "parentId",
  constraints: false,
});
Comment.belongsTo(Comment, {
  as: "parent",
  foreignKey: "parentId",
  constraints: false,
});

module.exports = { User, Post, Category, Comment };
