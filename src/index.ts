import express from "express";
import jwt from "jsonwebtoken";
import { UserModel, ContentModel } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";

const app = express();
app.use(express.json());

// signup
app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    await UserModel.create({
      username,
      password
    });

    res.json({
      message: "user signed up"
    });
  } catch (e) {
    res.status(411).json({
      message: "user already exists"
    });
  }
});

// signin
app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username, password });
  if (!user) {
    res.status(403).json({
      message: "invalid credentials"
    });
    return;
  }

  const token = jwt.sign(
    { userId: user._id },
    JWT_SECRET
  );

  res.json({ token });
});

// create content (PROTECTED)
app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, type } = req.body;

  const content = await ContentModel.create({
    link,
    type,
    //@ts-ignore
    userId: req.userId,
    tags: []
  });

  res.json({
    message: "content created",
    content
  });
});
app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const contents = await ContentModel.find({
    userId: req.userId
  }).populate("userId","username")

  res.json({
    contents
  });
});

app.delete("/api/v1/content",async(req,res)=>{
  const contentId=req.body.contentId;
  await ContentModel.deleteMany({
    contentId,
    //@ts-ignore
    userId: req.userId
  })
  res.json({
    message:"deleted"
  })
})

app.listen(3000, () => {
  console.log("server running on port 3000");
});