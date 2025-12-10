import mongoose from "mongoose";

export async function connectMongoDB(url:string):Promise<void> {
    await mongoose.connect(url).then(()=>{
        console.log("MongoDB Connected")
    })
}