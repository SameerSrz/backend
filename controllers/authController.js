const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/responseHandler");
const User = require("../models/user")

const register = async (req, res) => {
  try {
    console.log(req.body)
    const { username, password, email, confirmPassword } = req.body;
    
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

    await User.create({
        username: username,
        password: encryptedPassword,
        email,
    });

    sendResponse(res, 201);
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const login = async (req, res) => {
  try {
    let user = null;
    const { email, password } = req.body;

  
    // If User Enters Email
    if (email) {
      user = await User.findOne({ email:email });
    }

    if (user === null) {
      sendResponse(res, 404);
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        // Generate JWT Token
        const userToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );

        // Send User Data
        sendResponse(res, 200, {
          user,
          token: userToken,
        });
      } else {
        sendResponse(res, 401);
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