import express from "express" 
import dotenv from "dotenv";
import { connectDb } from "./utils/feature.js";

dotenv.config()

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

connectDb(mongoURI)

app.listen(port, ()=>{
    console.log(`server run on port ${port}`)
})

app.get("/",(req, res)=>{
    res.send("Hi i am a bat 🦇 virtual Assistant!")
})


export default app;