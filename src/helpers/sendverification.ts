import { resend } from "@/lib/resend";
import VerificationMail from "../../email/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, otp: string): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Email Verification",
            react: VerificationMail({ username, otp }),
        });
        return { success: true, message: "Verification email sent", isAcceptingMessage: true }

    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return { success: false, message: "Failde to send verification email", isAcceptingMessage: true }

    }

}


