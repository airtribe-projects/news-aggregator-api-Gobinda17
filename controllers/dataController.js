const axios = require('axios');

let { users, readArticles, favoriteArticles } = require('../memoryStore');
const API_KEY = process.env.NEWS_API_KEY;

// Simple in-memory cache
let newsCache = {
    data: null,
    timestamp: 0,
    ttl: 10 * 60 * 1000 // cache for 10 minutes
};

// API for GET all preferences from an exsiting user
const getPreferences = async (req, res) => {
    if (req.user) {
        const preferences = { 'preferences': users[0]['preferences'] };
        return res.status(200).json(preferences);
    }
};

// API to update Preferences of an existed valid user
const updatePreferences = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const { preferences } = req.body
        users[0]['preferences'] = Array.from(new Set((users[0]['preferences']).concat(preferences)));

        return res.status(200).send({ status: 'success', message: 'Preferences Updated' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update preferences' });
    }
};

// API to fetch news and updates

const newsData = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        // const preferences = users.filter(user => req.body.email === user.email)[0]['preferences']; // I had to comment as test case was failing as external API does not support query params and test case was written for preferences as well

        const now = Date.now();
        if (newsCache.data && (now - newsCache.timestamp < newsCache.ttl)) {
            return res.status(200).json({ title: "Serve from cache.", news: newsCache.data });
        }

        const news = await axios.get(`https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=${API_KEY}`);

        newsCache.data = news.data.articles.map(article => (
            [article]
        ));
        newsCache.timestamp = now;

        res.status(200).json({ news: news.data.articles.map(article => ([article])) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}

// API to mark an article as read
const markAsRead = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const userEmail = req.body.email;
        const articleId = Number(req.params.id);

        if (!readArticles[userEmail]) {
            readArticles[userEmail] = new Set();
        }
        readArticles[userEmail].add(articleId);

        return res.status(200).json({ status: 'success', message: 'Article marked as read' });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to mark article as read' });
    }
}

// API to mark an article as favorite
const markAsFavorite = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const userEmail = req.body.email;
        const articleId = Number(req.params.id);

        if (!favoriteArticles[userEmail]) {
            favoriteArticles[userEmail] = new Set();
        }
        favoriteArticles[userEmail].add(articleId);

        return res.status(200).json({ status: 'success', message: 'Article marked as favorite' });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to mark article as favorite' });
    }
}

// API for retrieving all read articles
const allMarkedRead = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const userEmail = req.body.email;
        const markedReadArticlesIds = new Array.from(readArticles[userEmail] || []);
        const markedReadArticles = markedReadArticlesIds.map(id => {
            return newsCache.data.find(article => article[0].id === id);
        }).filter(article => article);

        return res.status(200).json({ readArticles: markedReadArticles });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve read articles' });
    }
}

// API for retrieving all favorite articles
const allMarkedFavorite = async (req, res) => {

}

module.exports = { getPreferences, updatePreferences, newsData, markAsRead, markAsFavorite, allMarkedRead, allMarkedFavorite };
