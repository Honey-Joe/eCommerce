const nodemailer = require("nodemailer");

const sendInvoiceEmail = async (order, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to: order.buyerEmail,
    subject: `Invoice - Order #${order._id}`,
    html: `
      <p>Hi ${order.buyerName},</p>
      <p>Your order has been delivered successfully.</p>
      <p>Please find the attached invoice.</p>
      <p>Thank you for shopping with us!</p>
    `,
    attachments: [
      {
        filename: `invoice-${order._id}.pdf`,
        path: pdfPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendInvoiceEmail;
