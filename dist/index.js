"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const JWT_SECRET = "secret123";
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
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET);
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json({
            message: "your content",
            user: decoded
        });
    }
    catch {
        res.status(401).json({ message: "invalid token" });
    }
});
app.listen(3000, () => {
    console.log("server running on port 3000");
});
