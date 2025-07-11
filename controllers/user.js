import { TryCatch } from "../middlewares/error.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs"
import { cookieOptions, sendToken } from "../utils/feature.js";
import {ErrorHandler} from "../utils/errorHandler.js"

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



export {signUp, logIn, logOut};

