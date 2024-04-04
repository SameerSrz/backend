const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorHandler");
const connectDatabase = require("./Db/database")

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

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.get("/", (req, res) => {
  res.send("<h1>Backend Server is Running</h1>");
});


// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}/`)
);

module.exports = app;