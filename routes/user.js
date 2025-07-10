import express from "express";
import { logIn, logOut, signUp } from "../controllers/user.js";

const app = express.Router();

app.post("/signup", signUp)

app.post("/login", logIn)

app.get("/logout", logOut)

export default app;