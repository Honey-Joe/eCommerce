const ejs = require("ejs");
const puppeteer = require("puppeteer");
const path = require("path");

const generateInvoicePDF = async (order) => {
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(order.deliveredAt || Date.now()));

  // Render HTML from EJS template
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

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });
    
    // Generate PDF as Buffer (no file saved)
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    return pdfBuffer;
  } finally {
    // Ensure browser is closed even if an error occurs
    await browser.close();
  }
};

module.exports = generateInvoicePDF;