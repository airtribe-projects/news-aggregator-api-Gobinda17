# News Aggregator API

A Node.js RESTful API for aggregating news articles from external sources, allowing users to manage preferences, mark articles as read/favorite, and retrieve personalized news feeds.

## Features

- **User Preferences:** Set and update news category preferences.
- **News Aggregation:** Fetches news from the GNews API with in-memory caching for performance.
- **Read/Favorite Tracking:** Mark articles as read or favorite per user.
- **Retrieve Marked Articles:** Get all read or favorite articles for a user.
- **Keyword Search:** Search articles by keywords.
- **Simple In-Memory Storage:** No database required for demo purposes.

## Endpoints

| Method | Endpoint                 | Description                                 |
|--------|--------------------------|---------------------------------------------|
| POST   | `/users/signup`          | Register User                               |
| POST   | `/users/login`           | Log in to the system                        |
| GET    | `/users/preferences`     | Get user preferences                        |
| PUT    | `/users/preferences`     | Update user preferences                     |
| GET    | `/news`                  | Fetch latest news articles                  |
| POST   | `/news/:id/read`         | Mark an article as read                     |
| POST   | `/news/:id/favorite`     | Mark an article as favorite                 |
| GET    | `/news/read`             | Get all read articles for the user          |
| GET    | `/news/favorites`        | Get all favorite articles for the user      |
| GET    | `/news/search/:keyword`  | Search articles by keyword                  |

## Setup

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd news-aggregator-api-Gobinda17

2. **Install dependencies:**
    ```sh
   npm install

3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add your JWT_SECRET.
     ```
     JWT_SECRET=your_jwt_secret
     ```
   - Add your GNews API key:
     ```
     NEWS_API_KEY=your_gnews_api_key
     ```

4. **Run Server:**
    ```sh
   node app.js


## Usage
- Use an API client (like Postman) to interact with the endpoints.
- Authentication is assumed to be handled via `req.user` (mocked or via middleware).

## Notes
- **Caching:** News articles are cached in memory for 10 minutes to reduce external API calls.
- **Persistence:** All user data (preferences, read/favorite articles) is stored in memory and will reset on server restart.
- **External API:** News data is fetched from GNews API.


## License
**MIT**


<img alt="Open in Visual Studio Code" src="https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg">