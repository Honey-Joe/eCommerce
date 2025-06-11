const nodemailer = require("nodemailer");

const sendInvoiceEmail = async (order, pdfPath) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: false,
      service:"gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: order.buyerEmail,
      subject: `Invoice for Order ${order._id}`,
      text: "Thank you for your purchase. Please find your invoice attached.",
      attachments: [
        {
          filename: `invoice-${order._id}.pdf`,
          path: pdfPath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error; // so it bubbles up and hits your try/catch
  }
};

module.exports = sendInvoiceEmail;
