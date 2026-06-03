import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP Email
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 */
export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"SocietySmartHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP - SocietySmartHub",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0;">SocietySmartHub</h1>
          <p style="color: #64748b; font-size: 14px;">Secure Society Management</p>
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; text-align: center;">
          <h2 style="color: #1e293b; margin-top: 0;">Password Reset</h2>
          <p style="color: #475569; font-size: 16px;">You requested to reset your password. Use the following OTP to proceed:</p>
          <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; margin: 20px 0; padding: 10px; background: #fff; border: 2px dashed #cbd5e1; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
          &copy; 2024 SocietySmartHub. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email Sending Error:", error);
    return { success: false, error: error.message };
  }
};
