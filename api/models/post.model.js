const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    content: String,
    summary: String,
    cover: String,
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);
module.exports = Post;




