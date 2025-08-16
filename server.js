// const axios = require('axios');

// async function fun() {
//   try {
//     const response = await axios.post("https://leetcode.com/graphql", {
//       query: `
//         query recentAcSubmissions($username: String!, $limit: Int!) {
//           recentAcSubmissionList(username: $username, limit: $limit) {
//             titleSlug
//             timestamp
//           }
//         }
//       `,
//       variables: {
//         username: "premj01",
//         limit: 100
//       }
//     }, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log(JSON.stringify(response.data));
//   } catch (err) {
//     console.error("Error fetching data:", err.message);
//   }
// }

// fun();

// server.js
// This file acts as a proxy server to bypass CORS issues in the browser.

// 1. Import necessary packages
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// 2. Initialize the Express app
const app = express();
const port = 3000; // The port our server will run on

// 3. Apply middleware
// The 'cors' middleware allows our frontend (even on a different origin) to make requests to this server.
app.use(cors());
// The 'express.json()' middleware allows our server to understand incoming JSON request bodies.
app.use(express.json());

// 4. Define the proxy endpoint
// We'll create a POST endpoint at '/graphql' that our frontend will call.
app.post('/weekly_data', async (req, res) => {
  // Extract the username from the request body sent by the frontend
  const { username } = req.body;

  // Basic validation: make sure a username was provided
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // LeetCode's public GraphQL API endpoint
  // const leetcodeApiUrl = 'https://leetcode.com/graphql';

  // The GraphQL query structure that LeetCode expects
  // const graphqlQuery = {
  //   query: `
  //           query recentAcSubmissions($username: String!, $limit: Int!) {
  //               recentAcSubmissionList(username: $username, limit: $limit) {
  //                   titleSlug
  //                   timestamp
  //               }
  //           }
  //       `,
  //   variables: {
  //     username: username,
  //     limit: 100 // We can hardcode the limit here
  //   }
  // };

  // try {
  //   // Use axios to make a POST request to the actual LeetCode API
  //   const response = await axios.get(leetcodeApiUrl, graphqlQuery, {
  //     headers: { 'Content-Type': 'application/json' }
  //   });

  //   // Send the data received from LeetCode back to our frontend
  //   res.json(response.data);
  // } catch (error) {
  //   // If something goes wrong (e.g., user not found, LeetCode API is down)
  //   console.error('Error fetching from LeetCode API:', error.response ? error.response.data : error.message);
  //   res.status(error.response ? error.response.status : 500).json({
  //     error: 'Failed to fetch data from LeetCode API',
  //     details: error.response ? error.response.data : {}
  //   });
  // }
  try {
    console.log(`Fetching data for user: ${username}`);
    const response = await axios.post("https://leetcode.com/graphql", {
      // query: `
      //   query recentAcSubmissions($username: String!, $limit: Int!) {
      //     recentAcSubmissionList(username: $username, limit: $limit) {
      //       titleSlug
      //       timestamp
      //     }
      //   }
      // `,
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

    console.log(JSON.stringify(response.data));
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.json({ msg: err.message })
  }

});

// 5. Start the server
app.listen(port, () => {
  console.log(`LeetCode proxy server listening at http://localhost:${port}`);
});
