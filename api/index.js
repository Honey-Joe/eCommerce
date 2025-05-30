const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const sellerRoutes = require('./routes/sellerRoutes')
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const userRoutes = require('./routes/userRoutes');
const searchCountRoutes = require('./routes/searchCountRoutes');

dotenv.config();


 // Seed categories if needed

const cookieParser = require('cookie-parser');
app.use(cookieParser());

require('./cron/documentExpiryChecker');

connectDB();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use("/api/search", searchCountRoutes);



app.listen(port, () => {
  console.log('Server is running on '+port);

});
