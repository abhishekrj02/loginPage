import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./router/authRouter.js";
import { databaseconnect } from "./config/databaseConfig.js";
export const app = express();
import cors from "cors";

databaseconnect();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))



app.use('/api/auth', authRouter)
app.use('/', (req,res) => {
    res.status(200).json({
        data: 'JWTauth server'
    })
})
app.all("*","Oops something went wrong!!")

