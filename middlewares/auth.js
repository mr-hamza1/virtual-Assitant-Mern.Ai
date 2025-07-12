import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../utils/errorHandler.js';

const isAuthanticated = (req,res,next) => {
    
    const token = req.cookies["Bat-Virtual-Assistant"];

    if (!token) {
        return next(new ErrorHandler("please login to access this page",401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
       
    req.user = decodedData._id
    
    next();
}

export {isAuthanticated}
