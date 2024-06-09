const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/responseHandler");
const ServiceProvider = require("../models/serviceProvider");
const { getDataUri } = require("../utils/features");
const cloudinary = require('cloudinary').v2;
const User = require("../models/user")

const register = async (req, res) => {
        try {
            console.log(req.body)
            const { username, fullName, password, email, confirmPassword, service, phone } = req.body;
            const image = getDataUri(req.file);

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
    
        const result = await cloudinary.uploader.upload(image.content); 

        // const imageUrl = result.secure_url;

        await User.create({
            username: username,
            fullName,
            password: encryptedPassword,
            email,
            phone,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            },
            role: service
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

const updateLocation = async (req,res) =>{
  try {
    const { userId, location } = req.body;
    if (!userId || !location) {
      return res.status(400).send({ success: false, message: 'User ID and location are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found.' });
    }

    user.location = location;
    await user.save();
    res.send({ success: true, message: 'Location updated successfully.', user });

  } catch (error) {
    sendResponse(res, 500, error);
  }
}

const getDataUsingRole = async (req,res) =>{
  try {
    const { role } = req.body;
    const data = await User.find({ role: role });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}

const feedback = async (req,res) =>{
  try {
    const { providerId, username, feedback, rating } = req.body;
    const user = await User.findById(providerId);
    
    if (!user) {
        return res.status(404).send({ error: 'ServiceProvider not found' });
    }

    user.feedback.push({ username, comment: feedback, rating });
    await user.save();
    
    res.send({ message: 'Feedback submitted successfully' });
} catch (error) {
    res.status(500).send({ error: error.message });
}
}

module.exports = {
  register,
  login,
  updateLocation,
  getDataUsingRole,
  feedback,
};