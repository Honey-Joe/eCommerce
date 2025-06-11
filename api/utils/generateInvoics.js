const ejs = require("ejs");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

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

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Important for production (e.g., serverless)
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });

  await browser.close();
  return pdfPath;
};

module.exports = generateInvoicePDF;
