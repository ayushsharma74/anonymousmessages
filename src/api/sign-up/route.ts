import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";


export async function POST(request: Request) {

    dbConnect()
    
    try {
        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, message: "username already taken" }, { status: 400 })
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({
            email,
            isVerified: true
        })

        const OTP = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json({ success: false, message: "email already taken" }, { status: 400 })
            }
            else {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                existingUserVerifiedByEmail.password = hashedPassword
                existingUserVerifiedByEmail.verifyCode = OTP
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now()+1800000) // 30 minutes

                await existingUserVerifiedByEmail.save()
            }

        } else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: OTP,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(email, username, OTP)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        // return Response.json({
        //     success: true,
        //     message: emailResponse.message
        // }, { status: 201 })

        return Response.json({ success: true, message: "user registered successfully" }, { status: 200 })

    } catch (error) {
        console.error("error regestring user")
        return Response.json({ success: false, message: "user registration failed" }, { status: 500 })
    }
}
