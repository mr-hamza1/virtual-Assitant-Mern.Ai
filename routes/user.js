import express from "express";
import { askToAssistant, logIn, logOut, myProfile, signUp, updateAssistant } from "../controllers/user.js";
import { isAuthanticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/signup", signUp)

app.post("/login", logIn)


app.use(isAuthanticated)  

app.get("/me", myProfile)

app.get("/logout", logOut)

app.post("/updateAssistant", upload.single("assistantImage") , updateAssistant)

app.post("/askToAssistant", askToAssistant)

export default app;