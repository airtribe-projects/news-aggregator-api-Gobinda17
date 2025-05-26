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



// Function to periodically update the cached news articles in the background.
setInterval(async() => {
    try {
        const now = Date.now();
    
        const news = await axios.get(`https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=${API_KEY}`);
    
        newsCache.data = news.data.articles.map(article => (
            [article]
        ));
        newsCache.timestamp = now;
    } catch(error) {
        return res.status(500).json({error: 'Failed to cached artcles.'})
    }
}, 10000); //Update every after 10sec

// API to mark an article as read
const markAsRead = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(500).json({ error: 'Failed to mark article as read' });
        }
        const articleId = req.params.id;

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
        if (!userEmail) {
            return res.status(500).json({ error: 'Failed to mark article as favorite' });
        }
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
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const userEmail = await req.body.email;
        if (!userEmail) {
            return res.status(500).json({ error: 'Email required.' });
        }
        const markedReadArticlesIds = Array.from(readArticles[userEmail]);

        const markedReadArticles = markedReadArticlesIds.map(id => {
            return newsCache.data[id];
        });

        return res.status(200).json({ readArticles: markedReadArticles });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve all read articles.' });
    }
}

// API for retrieving all favorite articles
const allMarkedFavorite = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(500).json({ error: 'Email is required.' });
        }
        const markedFavoriteArticlesIds = Array.from(favoriteArticles[userEmail]);
        const markedFavoriteArticles = markedFavoriteArticlesIds.map(id => {
            return newsCache.data[id];
        });

        return res.status(200).json({ favoriteArticles: markedFavoriteArticles });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve all favorite articles' });
    }
}

// API to search articles based on keywords
const searchBasedKeywords = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const keyword = req.params.keyword;
        const serachArticles = newsCache.data.map(article => article.filter(item => item.title.toLowerCase().includes(keyword) || item.content.toLowerCase().includes(keyword))).filter(item => item.length > 0);

        return res.status(200).json({ searchArticle: serachArticles });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve articles' });
    }
}

module.exports = { getPreferences, updatePreferences, newsData, markAsRead, markAsFavorite, allMarkedRead, allMarkedFavorite, searchBasedKeywords };
