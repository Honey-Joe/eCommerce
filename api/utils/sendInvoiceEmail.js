const nodemailer = require('nodemailer');

const sendMailInvoice = async (order, pdfBuffer) => {
  try {
    const transporter = nodemailer.createTransport({
      // Your email transport configuration
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.buyerEmail,
      subject: `Your Order Invoice #${order._id}`,
      html: `<p>Thank you for your order. Please find your invoice attached.</p>`,
      attachments: [{
        filename: `invoice-${order._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Let the controller handle it
  }
};

module.exports = sendMailInvoice