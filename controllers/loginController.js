const { validationResult} = require('express-validator');

let {users} = require('../memoryStore');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;


// Register new user
const signUp = async (req, res) => {
    const validateResult = validationResult(req);

    if(!validateResult.isEmpty()) {
        return res.status(400).json({ status: 'fail', message: validateResult.array() });
    }

    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    users.push(req.body);
    res.status(200).json({ status: 'success', message: 'User Created.' });
}

// Login of an existing user
const logIn = async (req, res) => {
    const resUser = {
        name: users.name,
        email: users.email
    };

    const token = await jwt.sign(resUser, JWT_SECRET, { expiresIn: '1h' });

    users = { ...users[0], token };
    return res.status(200).json(users);
}

module.exports = { signUp, logIn };