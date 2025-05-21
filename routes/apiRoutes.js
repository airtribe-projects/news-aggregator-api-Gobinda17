const express = require("express");
const router = express.Router();

const {signUp} = require('../controllers/loginController');

// API for registering new user
router.post("/signup", signUp);

module.exports = router;