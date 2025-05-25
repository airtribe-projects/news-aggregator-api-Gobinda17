const express = require("express");
const router = express.Router();
const newsRoute = express.Router();

const { registerValidation } = require('../middlewares/validations');

const { signUp, logIn } = require('../controllers/loginController');
const { getPreferences, updatePreferences, newsData, markAsRead, markAsFavorite, allMarkedRead, allMarkedFavorite } = require('../controllers/dataController');

const { checkExistingUser, verifyLoginUser, verifyJWT } = require('../middlewares/auth');

// API for registering new user
router.post("/signup", [registerValidation, checkExistingUser], signUp);

// API for login
router.post("/login", [verifyLoginUser], logIn);

// API for GET all preferences from an exsiting user
router.get("/preferences", [verifyJWT], getPreferences);

// API to update user preferences
router.put("/preferences", [verifyJWT], updatePreferences);

// API to fetch news and updates
newsRoute.get("/", [verifyJWT], newsData);

// API to mark a article as read
newsRoute.post("/:id/read", [verifyJWT], markAsRead);

// API to mark a article as favorite
newsRoute.post("/:id/favorite", [verifyJWT], markAsFavorite);

// API to retrive all read articles
newsRoute.get("/read", [verifyJWT], allMarkedRead);

// API to retrive all favorite articles
newsRoute.get("/favorite", [verifyJWT], allMarkedFavorite);

module.exports = { router, newsRoute };