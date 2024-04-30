const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/responseHandler");
const ServiceProvider = require("../models/serviceProvider")
const cloudinary = require('cloudinary').v2;


const register = async (req, res) => {
  try {
    console.log(req.body)
    const { username, fullName, password, email, confirmPassword, service, phone } = req.body;
    const image = req.files.image;

    if(password !== confirmPassword){
      sendResponse(res, 401);
    }
    const encryptedPassword = bcrypt.hashSync(password, 10, (err, hash) => {
      if (!err) {
        return hash;
      } else {
        sendResponse(res, 400, err);
      }
    });
        // Upload image to Cloudinary
        //     const result = await cloudinary.uploader.upload(req.image);
        // if (result.error) {
        //   console.error('Cloudinary upload error:', result.error.message);
        //   sendResponse(res, 500, result.error.message);
        // }
    
        const result = await cloudinary.uploader.upload(image.tempFilePath); 

        const imageUrl = result.secure_url;

        await ServiceProvider.create({
            username: username,
            fullName,
            password: encryptedPassword,
            email,
            service,
            phone,
            avatar: imageUrl
        });



    sendResponse(res, 201);
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const login = async (req, res) => {
  try {
    let serviceProvider = null;
    const { username, password } = req.body;

  
    // If User Enters Email
    if (username) {
      serviceProvider = await ServiceProvider.findOne({ username:username });
    }

    if (user === null) {
      sendResponse(res, 404);
    } else {
      if (bcrypt.compareSync(password, serviceProvider.password)) {
        // Generate JWT Token
        const userToken = jwt.sign(
          {
            id: user.id,
            username: serviceProvider.username,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );

        // Send User Data
        sendResponse(res, 200, {
          serviceProvider,
          token: userToken,
        });
      } else {
        sendResponse(res, 405);
      }
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

module.exports = {
  register,
  login,
};