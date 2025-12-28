"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        await db_1.UserModel.create({ username, password });
        res.json({ message: "user signed up" });
    }
    catch {
        res.status(411).json({ message: "user already exists" });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = await db_1.UserModel.findOne({ username, password });
    if (!user) {
        res.status(403).json({ message: "invalid credentials" });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, config_1.JWT_SECRET);
    res.json({ token });
});
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const { title, link, tags } = req.body;
    const content = await db_1.ContentModel.create({
        title,
        link,
        tags: tags || [],
        userId: req.userId
    });
    res.json({ message: "content created", content });
});
app.get("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const contents = await db_1.ContentModel.find({
        userId: req.userId
    }).populate("userId", "username");
    res.json({ contents });
});
app.delete("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const { contentId } = req.body;
    await db_1.ContentModel.deleteOne({
        _id: contentId,
        userId: req.userId
    });
    res.json({ message: "deleted" });
});
app.post("/api/v1/share", middleware_1.userMiddleware, async (req, res) => {
    const { share } = req.body;
    if (share) {
        const existingLink = await db_1.LinkModel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        await db_1.LinkModel.findOneAndUpdate({ userId: req.userId }, { hash: hash }, { upsert: true });
        res.json({
            message: "/share/" + hash
        });
    }
    else {
        await db_1.LinkModel.deleteOne({ userId: req.userId });
    }
    res.json({ message: "updated sharable link" });
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_1.LinkModel.findOne({ hash });
    if (!link) {
        res.status(411).json({ message: "invalid link" });
        return;
    }
    const content = await db_1.ContentModel.find({
        userId: link.userId
    });
    const user = await db_1.UserModel.findOne({ _id: link.userId });
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
