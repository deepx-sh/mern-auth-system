import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB Connected Successfully!");
        
    } catch (error) {
        console.log("MongoDB Connection Error: ",error.message);
        process.exit(1);
    }
};

export default connectDB;