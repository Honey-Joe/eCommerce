const ejs = require("ejs");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const path = require("path");

const generateInvoicePDF = async (order) => {
  // Configure Chromium
  chromium.setGraphicsMode = false; // Disable GPU in serverless
  const executablePath = await chromium.executablePath();

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  });

  try {
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(order.deliveredAt || Date.now()));

    const html = await ejs.renderFile(
      path.join(__dirname, "../templates/invoice.ejs"),
      {
        invoiceNumber: order._id,
        customerName: order.buyerName,
        date: formattedDate,
        items: order.orderItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          unitPrice: item.price,
          total: item.price * item.quantity,
        })),
        total: order.totalPrice,
      }
    );

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

  } finally {
    await browser.close();
  }
};

module.exports = generateInvoicePDF;