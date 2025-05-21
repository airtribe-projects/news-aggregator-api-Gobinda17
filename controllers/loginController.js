const userModel = require('../models/userModels');

const bcrypt = require('bcrypt');
const saltRounds = 10;


// Register new user
const signUp = async (req, res) => {
    if (!req.body.email) {
        res.status(400).send({ message: 'Email fill is required.' });
    }

    req.body.password = await bcrypt.hash(req.body.password, saltRounds);

    userModel.create(req.body).then((dbUser) => {
        res.status(200).send({ message: `User Created${dbUser}` });
    }).catch((err) => {
        console.log(err)
        res.status(500).send({ message: 'Error Creating User' });
    });
}

module.exports = { signUp };
