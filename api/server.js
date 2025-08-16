// api/server.js

// 1. Import necessary packages
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// 2. Initialize the Express app
const app = express();

// 3. Apply middleware
app.use(cors());
app.use(express.json());

// 4. Define the proxy endpoint
app.post('/api/weekly_data', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    console.log(`Fetching data for user: ${username}`);
    const response = await axios.post("https://leetcode.com/graphql", {
      query: `
                query recentAcSubmissions($username: String!, $limit: Int!) {
                    recentAcSubmissionList(username: $username, limit: $limit) {
                        title
                        titleSlug
                        timestamp
                    }
                }
            `,
      variables: {
        username: username,
        limit: 100
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ msg: "Error fetching data from LeetCode", details: err.message });
  }
});

// 5. Export the app for Vercel
module.exports = app;
