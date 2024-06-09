const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const serviceProvider = new mongoose.Schema({
  username:{
    type: String,
    required: [true, "Please enter your name!"],
  },
  fullName:{
    type: String,
    required: [true, "Please enter your name!"],
  },
  email:{
    type: String,
    required: [true, "Please enter your email!"],
  },
  service:{
    type: String,
    required: [true, "Please enter your service!"],
  },
  password:{
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    // select: false,
  },
  confirmPassword:{
    type: String,
    // required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phone:{
    type: Number,
  },
  addresses:[
    {
      country: {
        type: String,
      },
      city:{
        type: String,
      },
      address1:{
        type: String,
      },
      address2:{
        type: String,
      },
      zipCode:{
        type: Number,
      },
      addressType:{
        type: String,
      },
    }
  ],
  rating: Number,
  feedback: [feedbackSchema],
  role:{
    type: String,
    default: "serviceProvider",
  },
  avatar:{
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
 },
 createdAt:{
  type: Date,
  default: Date.now(),
 },
 resetPasswordToken: String,
 resetPasswordTime: Date,
});

const feedbackSchema = new mongoose.Schema({
  username: String,
  comment: String,
  rating: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ServiceProvider", serviceProvider);