const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const sellerRoutes = require('./routes/sellerRoutes')
const productRoutes = require('./routes/productRoutes');
dotenv.config();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

require('./cron/documentExpiryChecker'); // <-- Import the cron job

connectDB();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productRoutes);


app.listen(port, () => {
  console.log('Server is running on '+port);
});
