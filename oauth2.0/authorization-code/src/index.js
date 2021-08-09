const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Because we don't want our client secret to be a not-so-secret, we pass it through command line arguments
const client_secret = process.argv[2];

// Persist access token in coolest way possible
let accessToken = '';

app.use(express.json());

// Redirect after successful authorisation and get access token by exchanging authorization code
app.get('/oauth/redirect', (req, res) => {
  // Extract authorization code from request query parameter
  const code = req.query.code;
  // Google provided OAuth url to get access token
  axios.post('https://oauth2.googleapis.com/token', {
    // Client ID generated as a prerequisite step
    client_id: '497369248462-huli8sh9cu609sdtjvn44p8i5jfnh8rt.apps.googleusercontent.com',
    // Client Secret generated as a prerequisite step
    client_secret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:3000/oauth/redirect'
  })
  .then(response => {
    // log successful response and redirect to the landing page
    console.log(response);
    accessToken = response.data.access_token;
    res.redirect('/landing');
  })
  .catch(err => {
    res.send(err.response.data);
  });
});

app.get('/landing', (req, res) => {
	const index = path.join(
		process.cwd(),
		'src/public/landing.html'
	);
	res.sendFile(index);
});

// middleware API to fetch user profile and return back to landing page because access token is not available to FE
app.get('/profile', (req, res) => {
  axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
  .then(response => {
    res.json(response.data);
  })
  .catch(err => {
    res.send(err.response.data);
  });
});

app.get('/', (req, res) => {
	const index = path.join(
		process.cwd(),
		'src/public/index.html'
	);
	res.sendFile(index);
});

const server = app
  .listen(
    port,
    () => console.log(`Listening at http://localhost:${port}`)
  );
