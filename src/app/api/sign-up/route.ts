import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendverification";
import UserModel from "@/model/User";
export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        // console.log(username, email, password)
        const existingUserVerificationByUsername = await UserModel.findOne({
            username,
            isVerified: false
        });
        
        if (existingUserVerificationByUsername) {
            return Response.json({ success: false, message: "Username already taken" }, { status: 400 });
        }

        const existingByUser = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingByUser) {
            if (existingByUser.isVerified) {

                return Response.json({ success: false, message: "User already exists" }, { status: 400 });

            } else {
                const hasedPassword = await bcrypt.hash(password, 10);
                existingByUser.password = hasedPassword;
                existingByUser.verifyCode = verifyCode;
                existingByUser.verifyCodeExpires = new Date(Date.now() + 3600000);
                await existingByUser.save();

            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpires: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []

            })

            await newUser.save();
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        // console.log(emailResponse)
        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 });
        }
        return Response.json({ success: true, message: "User registered successfully" }, { status: 200 });




    } catch (error) {
        console.error("Error register user", error);
        return Response.json({ success: false, message: "Failed to register user" }, { status: 500 });
    }

}

