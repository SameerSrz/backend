const express = require("express");
const multer = require("multer");
const { register, login } = require("../controllers/serviceProvider");
const { singleUpload } = require("../multer")

const router = express.Router();
// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", singleUpload , register);
router.post("/login", login);

module.exports = router;