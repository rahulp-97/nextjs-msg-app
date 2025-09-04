import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect();
    try {
        // fetching username email and password from user req (from frontend input fields)
        const { username, email, password } = await request.json();
        const isExistingUserVerifiedByUserName = await UserModel.findOne({ username });
        // username availability
        if (isExistingUserVerifiedByUserName) {
            return Response.json({
                status: false,
                message: "username is already taken"
            }, {
                status: 400
            })
        }
        // find user by email & generating OTP (verifyCode here)
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                // check if user was already VERIFIED end API execution here.
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, { status: 400 });
            } else {
                // checking if USER exists with this email but is NOT VERIFIED
                // at this point user might forgot his password and entering different password from previous one.
                // then we need to update the password because user was not verified earlier.
                // And need to update OTP & set new expiry for OTP
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
                // Then send verification email part will be executer after this point.
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            // setting OTP expiry to one hour
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            await newUser.save();
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 });
        }
        return Response.json({
            success: true,
            message: "User registered successfully, Please verify your email."
        }, { status: 201 });
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })
    }
}