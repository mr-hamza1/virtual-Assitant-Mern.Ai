import express from "express";
import { logIn, logOut, myProfile, signUp } from "../controllers/user.js";
import { isAuthanticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/signup", signUp)

app.post("/login", logIn)


app.use(isAuthanticated)  

app.get("/me", myProfile)

app.get("/logout", logOut)


export default app;