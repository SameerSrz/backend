const express = require("express");
const multer = require("multer");
const { register, login, updateLocation } = require("../controllers/serviceProvider");
const { singleUpload } = require("../multer")

const router = express.Router();
// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", singleUpload , register);
router.post("/login", login);
router.post("/update-location", updateLocation)

module.exports = router;