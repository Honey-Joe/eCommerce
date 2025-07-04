const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendMail = async (to, buyerName, subject, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // app-specific password
      },
    });

    // Read HTML file for OTP template
    const htmlPath = path.join(__dirname, "../views/email/otp.html");
    let htmlContent = fs.readFileSync(htmlPath, "utf-8");

    // Replace placeholders
    htmlContent = htmlContent
      .replace("{{OTP}}", otp)
      .replace("{{BuyerName}}", buyerName);

    const mailOptions = {
      from: `"ShopEase" <${process.env.EMAIL_USER}>`, // Custom sender name
      to,
      subject,
      html: htmlContent,
    };
    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
};

module.exports = sendMail;
