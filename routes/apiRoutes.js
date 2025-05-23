const express = require("express");
const router = express.Router();

const { signUp, logIn } = require('../controllers/loginController');
const { getPreferences, updatePreferences } = require('../controllers/dataController');

const { checkExistingUser, verifyLoginUser, verifyJWT } = require('../middlewares/auth');

// API for registering new user
router.post("/signup", [checkExistingUser], signUp);

// API for login
router.post("/login", [verifyLoginUser], logIn);

// API for GET all preferences from an exsiting user
router.get("/preferences", [verifyJWT], getPreferences);

// API to update user preferences
router.put("/preferences", [verifyJWT], updatePreferences);

module.exports = router;