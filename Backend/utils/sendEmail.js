// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER, // e.g., yourapp@gmail.com
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"MyBlog Support" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};
