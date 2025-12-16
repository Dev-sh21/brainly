// index.ts
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";

const app = express();
app.post("/api/v1/signup",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  UserModel.create 

})
app.post("/api/v1/signin",(req,res)=>{
  
})
app.get("/api/v1/content",(req,res)=>{
  
})
app.delete("/api/v1/content",(req,res)=>{
  
})

app.post("api/v1/brain/share", (req,res)=>{

})

app.get("api/v1/brain/shareLink", (req,res)=>{
  
})