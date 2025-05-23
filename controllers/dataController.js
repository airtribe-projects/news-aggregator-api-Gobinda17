let users = require('../memoryStore');


// API for GET all preferences from an exsiting user
const getPreferences = async (req, res) => {
    if (req.user) {
        const preferences = { 'preferences': users[0]['preferences'] };
        return res.status(200).json(preferences);
    }
};

// API to update Preferences of an existed valid user
const updatePreferences = async (req, res) => {
    if (req.user) {
        const { preferences } = req.body
        users[0]['preferences'] = Array.from(new Set((users[0]['preferences']).concat(preferences)));
        return res.status(200).send({status: 'success', message: 'Preferences Updated'});

    }
};

module.exports = { getPreferences, updatePreferences }
