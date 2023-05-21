const express = require("express");
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request was made to /tags");

  next();
});

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags: [],
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagName } = req.params;

  try {
    const posts = await getPostsByTagName(tagName);
    //send an object to the client { post: the post }
    res.send({ posts });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
