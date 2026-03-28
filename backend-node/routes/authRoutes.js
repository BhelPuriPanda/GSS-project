const express = require('express');
const {
    signup,
    login,
    sendotp,
} = require('../controllers/authController');

const router = express.Router();

router.post('/sendotp', sendotp);
router.post('/signup', signup);
router.post('/login', login);

router.post("/forgot-password", require("../controllers/authController").forgotPassword)
router.post("/reset-password", require("../controllers/authController").resetPassword)
router.post("/register", require("../controllers/authController").fastRegister)

module.exports = router;
