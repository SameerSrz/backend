const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorHandler");
const connectDatabase = require("./Db/database")
const cloudinary = require('cloudinary').v2;


// App Initialization
const app = express();

const corsOptions = {
  origin: [
    'exp://192.168.43.190:8081',
    'exp://192.168.43.144:46557',
    'exp://10.0.2.2:8081'
  ]
};

// Middleware
app.use(cors(corsOptions));
app.use(errorHandler);
app.use(morgan(process.env.NODE_ENV));
app.use(express.json({ limit: "200mb", extended: true }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// connecting database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
}); 

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/serviceProviderAuth", require("./routes/serviceProvider"));


app.get("/", (req, res) => {
  res.send("<h1>Backend Server is Running</h1>");
});


// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}/`)
);

module.exports = app;