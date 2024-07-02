import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const MONGODB_URL = process.env.MONGODB_URL
export const databaseconnect = () => {
    mongoose
    .connect(MONGODB_URL)
    .then((conn) => console.log(`Connected to DB: ${conn.connection.host}`))
    .catch((err) => console.log(err.message)); 
}   