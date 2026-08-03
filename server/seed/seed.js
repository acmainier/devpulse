// Reusable dev seed script. Run with: node seed/seed.js
// Wipes existing posts/categories and repopulates sample data from seed.json,
// so you can reset to a known-good state anytime after testing/clearing the database.

const sequelize = require("../config/connection");
const { User, Category, Post } = require("../models");
const {
  users: seedUsers,
  categories: categoryNames,
  posts,
} = require("./seed.json");

async function seed() {
  await sequelize.sync();

  // Clear existing posts and categories first (posts depend on categories via FK).
  // Plain destroy (DELETE), not truncate: true — TRUNCATE fails whenever any
  // foreign key references the table, even an empty one.
  await Post.destroy({ where: {} });
  await Category.destroy({ where: {} });

  // findOrCreate so re-running this script doesn't fail on a duplicate user
  const userMap = {};
  for (const seedUser of seedUsers) {
    const [user] = await User.findOrCreate({
      where: { email: seedUser.email },
      defaults: seedUser,
    });
    userMap[seedUser.username] = user.id;
  }

  const categoryMap = {};
  for (const name of categoryNames) {
    const category = await Category.create({ category_name: name });
    categoryMap[name] = category.id;
  }

  await Post.bulkCreate(
    posts.map((post) => ({
      title: post.title,
      content: post.content,
      categoryId: categoryMap[post.category],
      userId: userMap[post.author],
    })),
  );

  console.log(
    `Seeded ${seedUsers.length} users, ${categoryNames.length} categories, and ${posts.length} posts.`,
  );
  console.log("Seed users (same password for all):");
  for (const seedUser of seedUsers) {
    console.log(`  ${seedUser.email} / ${seedUser.password}`);
  }
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
