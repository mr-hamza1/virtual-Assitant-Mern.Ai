import express from "express" 
import dotenv from "dotenv";
import { connectDb } from "./utils/feature.js";
import userRoutes from "./routes/user.js"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors"
import { v2 as cloudinary } from 'cloudinary';
import { errorMiddleware } from "./middlewares/error.js";

dotenv.config()

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDb(mongoURI)

const corsOptions ={              
    origin: [process.env.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}

app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes)

app.use(errorMiddleware)

app.listen(port, ()=>{
    console.log(`server listen on port ${port}`)
})

app.get("/",(req, res)=>{
    res.send("Hi i am a bat 🦇 virtual Assistant!")
})


export default app;