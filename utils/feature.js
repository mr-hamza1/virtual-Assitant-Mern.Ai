import mongoose from "mongoose"



const connectDb = (uri)=>{
    mongoose.connect(uri, {dbName: "Bat-virtual-Assistant"})
    .then((data) => console.log(`connected to DB : ${data.connection.host}`))
    .catch((err)=> {throw err})
}

export {connectDb};