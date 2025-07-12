import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};

const connectDb = (uri)=>{
    mongoose.connect(uri, {dbName: "Bat-virtual-Assistant"})
    .then((data) => console.log(`connected to DB : ${data.connection.host}`))
    .catch((err)=> {throw err})
}

const sendToken = (res, user, code, message)=>{

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(code).cookie("Bat-Virtual-Assistant", token, cookieOptions).json({
        success: true,
        message,
        user,
    })

}

const uploadFileToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(
            getBase64(file),
            { resource_type: "auto" }
        );

        return {
            url: result.secure_url,
            image_id: result.public_id,
        };

    } catch (error) {
        throw new Error("Failed to upload file to Cloudinary: " + error.message);
    }
};

export {connectDb, sendToken, cookieOptions, uploadFileToCloudinary};