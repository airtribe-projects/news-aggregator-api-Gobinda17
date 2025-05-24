const axios = require('axios');

let users = require('../memoryStore');
const API_KEY = process.env.NEWS_API_KEY;

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
        return res.status(200).send({ status: 'success', message: 'Preferences Updated' });

    }
};

// API to fetch news and updates
const newsData = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const news = await axios.get(`https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=${API_KEY}`);

        res.status(200).json({news: news.data.articles});
    } catch (error) {
        console.error('News fetch error:', error.message);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}

module.exports = { getPreferences, updatePreferences, newsData }
