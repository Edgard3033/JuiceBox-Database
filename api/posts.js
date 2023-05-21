const express = require("express");
const postsRouter = express.Router();
const { getAllPosts } = require("../db");
const { requireUser } = require("./utils");
const { createPost } = require("../db");

postsRouter.post("/", requireUser, async (req, res, next) => {
  res.send({ message: "under construction" });

  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const postData = { authorId, title, content };
    const post = await createPost(postData);

    if (post) {
      res.send({ post });
    } else {
      next({
        name: "Error Creating Post",
        message: "There was an error creating post. Please try again.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.use((req, res, next) => {
  console.log("A request was made to /post");

  next();
});

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts: [],
  });
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;
