import mongoose, { Schema, model } from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/brainly")
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error", err));

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

export const UserModel = model("User", UserSchema);