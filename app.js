import express from "express" 
import dotenv from "dotenv";
import { connectDb } from "./utils/feature.js";
import userRoutes from "./routes/user.js"
import cookieParser from "cookie-parser";
import morgan from "morgan";

dotenv.config()

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

connectDb(mongoURI)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes)

app.listen(port, ()=>{
    console.log(`server run on port ${port}`)
})

app.get("/",(req, res)=>{
    res.send("Hi i am a bat 🦇 virtual Assistant!")
})


export default app;