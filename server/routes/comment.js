const express = require("express");
const router = express.Router();
const { Comment, User } = require("../models");
const authMiddleware = require("../middleware/auth");

// POST /api/posts/:postId/comments — create a comment, or a reply if parentId is given
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const { content, parentId } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (parentId) {
      const parent = await Comment.findByPk(parentId);

      if (!parent || parent.postId !== Number(postId)) {
        return res.status(400).json({ error: "Invalid parent comment" });
      }

      if (parent.parentId !== null) {
        return res.status(400).json({ error: "Cannot reply to a reply" });
      }
    }

    const comment = await Comment.create({
      content,
      postId,
      parentId: parentId || null,
      userId: req.user.id,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/posts/:postId/comments — list a post's comments, with replies nested inside
router.get("/posts/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId, parentId: null },
      include: [
        { model: User, attributes: ["id", "username"] },
        {
          model: Comment,
          as: "replies",
          include: [{ model: User, attributes: ["id", "username"] }],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;