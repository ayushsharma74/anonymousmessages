import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
) : Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code | Anonymous Messages',
            react: verificationEmail({username, otp:verifyCode}),
          });
        return {
            success: true,
            message: "Sent Verification Code to Verify Email Successfully"
        }
    } catch (error) {
        console.error("Error Sending Verify Email")
        return {
            success: false,
            message: "Error Sending Verify Email"
        }
    }
}
