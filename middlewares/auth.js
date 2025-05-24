const users = require('../memoryStore');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Checking for Existing Email
const checkExistingUser = (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).send({ status: 'fail', message: 'Email fill is required.' });
    }
    const userExist = users.find(user => user.email === req.body.email);
    if (userExist) {
        return res.status(409).send({ status: 'fail', message: 'User Already Exist' });
    }
    next();
}

// Checking Email and Password for Login of an existing User
const verifyLoginUser = async (req, res, next) => {
    const { email, password } = req.body;

    const userValid = users.find(user => email === user.email);

    if (!userValid) {
        return res.status(401).send({ text: 'Invalid Email.' })
    }

    const isPasswordValid = await bcrypt.compare(password, userValid.password);

    if (!isPasswordValid) {
        return res.status(401).send({ text: 'Invalid Password' });
    }
    next();
}

// Verify JWT
const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).send({text: 'Token not provided.'});
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).send({text: 'Invalid Token.'});
        }
        req.user = decoded;
        next();
    });
}

module.exports = { checkExistingUser, verifyLoginUser, verifyJWT };