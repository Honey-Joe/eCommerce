const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const userRoutes = require("./routes/userRoutes");
const searchCountRoutes = require("./routes/searchCountRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require('./routes/cartRoutes');
const siteSettingsRoutes = require("./routes/siteSettingsRoutes");


dotenv.config();

// Seed categories if needed

const cookieParser = require("cookie-parser");
app.use(cookieParser());

require("./cron/documentExpiryChecker");

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://ecommerce25025.vercel.app",
  process.env.ADMIN_URL,
  "https://ecommerceintern25.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/search", searchCountRoutes);
app.use("/api/orders", orderRoutes );
app.use("/api/cart",cartRoutes)
app.use("/api/site-settings", siteSettingsRoutes);


app.listen(port, () => {
  console.log("Server is running on " + port);
});
