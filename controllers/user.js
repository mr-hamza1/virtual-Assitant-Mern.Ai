import { TryCatch } from "../middlewares/error.js";
import User from "../models/user.js";


const signUp = TryCatch(async(req, res, next)=>{

    const { name , email, image, gender, password} = req.body

    
  const user = await User.findOne({ email }).select("+password")

    if(password.length < 6){
        return 
    }
   
   
    const isMatch = await compare(password, user.password)
 
    if (user && isMatch){
         return  sendToken(res, user, 201, `Welcome Back ${user.name}`);
        }

      if (!name || !email || !gender || !password)
        return next(new ErrorHandler("Please add all fields", 400));


     user = await User.create({ name, email, image, gender, password })
     
     console.log(user)

     sendToken(res, user, 201, `Successfully Signup ${user.name}!`);
})


