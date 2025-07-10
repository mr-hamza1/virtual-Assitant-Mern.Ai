import express from "express";
import { signUp } from "../controllers/user.js";

const app = express.Router();

app.post("/signUp", signUp)

export default app;