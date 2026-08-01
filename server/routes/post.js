const express = require("express");
const router = express.Router();
const { Post, User, Category } = require("../models");
const authMiddleware = require("../middleware/auth");

// POST
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;

    if (!title || !content || !categoryId) {
      return res
        .status(400)
        .json({ error: "Title, content, and category are all required" });
    }

    const post = await Post.create({
      title,
      content,
      categoryId,
      userId: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Category, attributes: ["id", "category_name"] },
      ],
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//GET by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Category, attributes: ["id", "category_name"] },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only edit your own posts" });
    }

    const { title, content, categoryId } = req.body;

    await post.update({ title, content, categoryId });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own posts" });
    }

    await post.destroy();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
