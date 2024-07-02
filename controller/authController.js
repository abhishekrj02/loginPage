import { userModel } from "../model/userSchema.js";
import { validate } from "email-validator";
import bcrypt from "bcrypt";
export const signup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Every field is required!"
        })
    }

    const validEmail = validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: "Provide valide email"
        })
    }

    if (password != confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password not same"
        })
    }


    try {
        const userinfo = userModel(req.body)
        const result = await userinfo.save()

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            })
        }
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

export const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is required!"
        })
    }
    try {
        const user = await userModel.findOne({
            email
        })
            .select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or passsword"
            })
        }

        const token = user.jwtToken();
        user.password = undefined;

        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        };

        res.cookie("token", token, cookieOption)
        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })

    }

}

export const getUser = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId)
        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        }
        res.cookie("token", null, cookieOption)
        res.status(200).json({
            success: true,
            message: "Logged out"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}