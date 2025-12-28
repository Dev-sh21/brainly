import mongoose, { Schema, model } from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/brainly")
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error", err));

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
  title: { type: String },
  link: { type: String, required: true },
  tags: [{ type: String }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
  hash: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  }
});

export const LinkModel = model("Link", LinkSchema);