import mongoose, { Schema, model } from "mongoose";
import { ref } from "process";

mongoose.connect("mongodb://127.0.0.1:27017/brainly")
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error", err));

//user

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

export const UserModel = model("User", UserSchema);

//content

const ContentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, required: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },
  authorId:{
    type: mongoose.Types.ObjectId,
    ref:"user",
    required: true
  },
  tags: [{ type: String }]
});

export const ContentModel = model("Content", ContentSchema);