require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model.js");
const Post = require("./models/post.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://pranavkale1124:${process.env.BLOG_APP_PASSWORD}@cluster0.flessso.mongodb.net`
  );
};
connectDB();
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    if (!userDoc) {
      console.log("UserDoc not found");
    }
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(400).json("UserDoc not found for login");
  }
  const passOk = await bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    await jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token, { httpOnly: true, secure: true }).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Invalid Credentials");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const fileName = originalname?.split(".");
    const fileExtension = fileName?.pop();
    const newFileName = `${fileName.join(".")}.${fileExtension}`;
    const newPath = `uploads/${newFileName}`;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;

      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        author: info?.id,
        cover: newPath,
      });
      res.json(postDoc);
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "JWT token is missing" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Invalid JWT token" });
    }
    res.json(info);
  });
});

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 });
    if (!posts) {
      console.log("Posts not found");
    }
    res.json(posts);
  } catch (error) {
    console.log("Error fetching posts", error);
  }
});

app.get("/post/:id", async (req, res) => {
  const postInfo = await Post.findById(req.params.id).populate("author", [
    "username",
  ]);
  if (!postInfo) {
    console.log("Post not found");
  }
  res.json(postInfo);
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.find({ _id: id });
    if (!postDoc) {
      console.log("No previous post data found");
    }
    const isAuthor =
      JSON.stringify(postDoc[0]?.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc[0].cover,
      },
      { new: true }
    );

    res.json(updatedPost);
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running on port 4000");
});
