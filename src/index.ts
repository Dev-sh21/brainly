import express from "express";
import jwt from "jsonwebtoken";
import { UserModel, ContentModel, LinkModel } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    await UserModel.create({ username, password });
    res.json({ message: "user signed up" });
  } catch {
    res.status(411).json({ message: "user already exists" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username, password });
  if (!user) {
    res.status(403).json({ message: "invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { userId: user._id.toString() },
    JWT_SECRET
  );

  res.json({ token });
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { title, link, tags } = req.body;

  const content = await ContentModel.create({
    title,
    link,
    tags: tags || [],
    userId: req.userId
  });

  res.json({ message: "content created", content });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const contents = await ContentModel.find({
    userId: req.userId
  }).populate("userId", "username");

  res.json({ contents });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const { contentId } = req.body;

  await ContentModel.deleteOne({
    _id: contentId,
    userId: req.userId
  });

  res.json({ message: "deleted" });
});

app.post("/api/v1/share", userMiddleware, async (req, res) => {
  const { share } = req.body;

  if (share) {
    const existingLink= await LinkModel.findOne({
      userId:req.userId
    });
    if(existingLink){
    res.json({
      hash: existingLink.hash
    })
      return;

    }
    const hash=random(10);
    await LinkModel.findOneAndUpdate(
      { userId: req.userId },
      {hash: hash},
      { upsert: true }
    );
    res.json({
      message: "/share/"+hash
    })
  } else {
    await LinkModel.deleteOne({ userId: req.userId });
  }

  res.json({ message: "updated sharable link" });
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({ hash });
  if (!link) {
    res.status(411).json({ message: "invalid link" });
    return;
  }

  const content = await ContentModel.find({
    userId: link.userId
  });

  const user = await UserModel.findOne({_id:link.userId});
  if (!user) {
    res.status(411).json({ message: "user not found" });
    return;
  }

  res.json({
    username: user.username,
    content
  });
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});