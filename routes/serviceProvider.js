const express = require("express");
const multer = require("multer");
const { register, login } = require("../controllers/serviceProvider");
const upload = require("../upload")

const router = express.Router();
// Multer configuration
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

router.post("/register",upload.single('image'), register);
router.post("/login", login);

module.exports = router;