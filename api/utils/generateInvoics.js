const ejs = require("ejs");
const pdf = require("html-pdf"); // or use puppeteer for high quality
const path = require("path");

const generateInvoicePDF = async (order) => {
  const html = await ejs.renderFile(
    path.join(__dirname, "../templates/invoice.ejs"),
    {
      invoiceNumber: order._id,
      customerName: order.buyerName,
      date: new Date(order.deliveredAt).toLocaleDateString(),
      items: order.orderItems.map((item) => ({
        name: item.name,
        qty: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
      })),
      total: order.totalPrice,
    }
  );

  const pdfPath = path.join(__dirname, "../temp", `invoice-${order._id}.pdf`);
  await new Promise((resolve, reject) => {
    pdf.create(html).toFile(pdfPath, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

  return pdfPath;
};

module.exports = generateInvoicePDF;
