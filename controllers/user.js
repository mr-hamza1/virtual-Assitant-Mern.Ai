import { TryCatch } from "../middlewares/error.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs"
import { cookieOptions, sendToken, uploadFileToCloudinary } from "../utils/feature.js";
import {ErrorHandler} from "../utils/errorHandler.js"
import gemeniResponse from "../gemini.js";
import { response } from "express";
import moment from "moment/moment.js";

const signUp = TryCatch(async (req, res, next) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please add all fields", 400));
  }

  let user = await User.findOne({ email });

  if (user) {
    return res.status(401).json({
      message: "User already registered",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters!",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword, 
  });
     
     sendToken(res, user, 201, `Successfully Signup ${user.name}!`);
})


const logIn = TryCatch(async (req, res, next) => {

  const { email, password } = req.body;

  
  if (!email)
    return next(new ErrorHandler("Please enter email", 400));


  if (!password)
    return next(new ErrorHandler("Please enter password", 400));


  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new ErrorHandler("You are not SignUp", 404));
  }

    const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) { 
    return  next(new ErrorHandler("Invalid  password",404))
  }

  sendToken(res, user, 200, `Welcome Back ${user.name}`);
});

const logOut = TryCatch(async (req, res) => {

  console.log("logout!")

  return  res.clearCookie("Bat-Virtual-Assistant", {...cookieOptions, maxAge: 0}).json({
      success: true,
      message: "Logout successfully!",
    });
});

const myProfile = TryCatch(async (req, res, next) => {

  const user = await User.findById(req.user);

  if (!user) {
    return next(new ErrorHandler("user not found",404))
  }

  res.status(200).json({
    success: true,
    user,
  })
});

const updateAssistant = TryCatch(async(req, res, next)=>{

  const {assistantName, imageUrl} = req.body;
  let assistantImage;

  const image = req.file

  console.log(image)

  if(image){
    assistantImage = await uploadFileToCloudinary(image);
  }
  else if(imageUrl){
    assistantImage = imageUrl;
  }

  console.log(req.file)

  const user = await User.findByIdAndUpdate(req.user ,{
    assistantName,
    assistantImage
  },{new: true}).select("-password")

  return res.status(200).json({
    success: true,
    message: "Successfully Updated!",
    user,
  })
})



const askToAssistant = async (req, res, next) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await gemeniResponse(command, assistantName, userName);

    if (!result) {
      return res.status(500).json({ response: "Gemini response failed" });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

     console.log(gemResult)

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`, // Fixed typo: "mmmm" → "MMMM"
        });

      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
      case "moviesmod_open":
      case "chatgpt_open":
      case "youtube_open":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res.status(400).json({
          type,
          userInput: gemResult.userInput,
          response: `I didn't understand this command`,
        });
    }
  } catch (error) {
    console.error("Assistant error:", error); // Add this for better debugging
    return res.status(500).json({
      response: `Ask assistant error`,
    });
  }
};


export {signUp, logIn, logOut, myProfile, updateAssistant, askToAssistant};

