dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { connectToDb } = require('./config/db');
const app = express();
const allRoutes = require('./routes/AllRoutes');
const multer = require('./middleware/multer');
app.use(express.json());
app.use(cors({
    origin: 'https://lyrine-store.netlify.app/'
}));
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 4000;
connectToDb() //connect to MongoDB


app.use('/api', allRoutes);
app.get('/', (req, res) => {
    res.send("Welcome to the E-commerce API");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});