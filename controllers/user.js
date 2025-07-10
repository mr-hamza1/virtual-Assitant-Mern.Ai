import { TryCatch } from "../middlewares/error.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs"


const signUp = TryCatch(async (req, res, next) => {

  const { name, email, gender, password } = req.body;

  if (!name || !email || !gender || !password) {
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
    gender,
    password: hashedPassword, 
  });
     
     console.log(user)


    //  sendToken(res, user, 201, `Successfully Signup ${user.name}!`);
})

export {signUp};

