import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";

const app = express();
app.use(express.json());

const JWT_SECRET = "secret123";

// signup
app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

 try{ 
   await UserModel.create({
    username,
    password
  });

  res.json({
    message: "user signed up"
  })
} catch(e){
  res.status(411).json({
    message:"user already exists"
  })
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

// protected content
app.get("/api/v1/content", (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "no token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      message: "your content",
      user: decoded
    });
  } catch {
    res.status(401).json({ message: "invalid token" });
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});