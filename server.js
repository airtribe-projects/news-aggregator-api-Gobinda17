require('dotenv').config();
const mongoose = require('mongoose');
const app = require("./app");

const MONGO_URI = process.env.MONGO_DB_URI;
const port = 3000;

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        app.listen(port, (err) => {
            if (err) {
                return console.log('Something bad happened', err);
            }
            console.log(`Server is listening on ${port}`);
        });
    } catch(error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

startServer();