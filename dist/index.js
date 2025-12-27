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
const app = (0, express_1.default)();
app.use(express_1.default.json());
// signup
app.post("/api/v1/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        await db_1.UserModel.create({
            username,
            password
        });
        res.json({
            message: "user signed up"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "user already exists"
        });
    }
});
// signin
app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = await db_1.UserModel.findOne({ username, password });
    if (!user) {
        res.status(403).json({
            message: "invalid credentials"
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.JWT_SECRET);
    res.json({ token });
});
// create content (PROTECTED)
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const { link, type } = req.body;
    const content = await db_1.ContentModel.create({
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
app.listen(3000, () => {
    console.log("server running on port 3000");
});
