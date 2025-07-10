import { model, Schema } from "mongoose";


const schema = new Schema({
     name:{
        type: String,
     },
     gender:{
        type: String,
        enum:["male", "female"]
     },
     email:{
        type: String,
        required: true,
        unique: true,
     },
     password:{
        type: String,
        required: true,
     },
     assistantName:{
        type: String,
     },
     assistantImage:{
        type: String,
     },
     history:[
        {
            type: String,
        }
     ],
},{
    timestamps: true
})

const User = model("User", schema)

export default User;