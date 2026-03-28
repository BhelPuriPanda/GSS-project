const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const User = require('../models/userModel');
const OTP = require('../models/OTP');
const AppError = require('../utils/AppError');
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    const checkUserPresent = await User.findOne({ email })

    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp });
    }
    const otpPayload = { email, otp }
    await OTP.create(otpPayload)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
    })
  } catch (error) {
    console.log("Error in sendotp:", error.message)
    return res.status(500).json({ success: false, message: error.message })
  }
}



exports.signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      otp

    } = req.body
    if (!fullName || !email || !password || !otp) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    const existingUserId = await User.findOne({ uniqueId })
    if (existingUserId) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      fullName,
      uniqueId,
      email,
      password: hashedPassword,

    })

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )

    return res.status(200).json({
      success: true,
      token,
      user: { ...user.toObject(), token },
      message: "User registered successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { uniqueId, password } = req.body

    if (!uniqueId || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }

    const user = await User.findOne({
      $or: [{ email: uniqueId }, { uniqueId: uniqueId }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      )

      user.token = token
      user.password = undefined

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user: { ...user.toObject(), token },
        message: `User Login Success`,
      })
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
  }
}


//FORGOT PASSWORD - send OTP to existing user

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // generate OTP and save (OTP model pre-save sends email)
    let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    let exists = await OTP.findOne({ otp });
    while (exists) {
      otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
      exists = await OTP.findOne({ otp });
    }

    await OTP.create({ email, otp });

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// RESET PASSWORD - verify OTP and set new password

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ success: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.fastRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Missing fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: name,
      email,
      uniqueId: email,
      password: hashedPassword
    });

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    return res.status(200).json({ success: true, token, user: { ...user.toObject(), token }, message: "Registered instantly" });
  } catch (err) {
    console.error("fastRegister error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

