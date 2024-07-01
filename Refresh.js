const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Read client secret JSON file
const clientSecret = JSON.parse(fs.readFileSync('client_secret.json')).web;

const oauth2Client = new google.auth.OAuth2(
  clientSecret.client_id,
  clientSecret.client_secret,
  clientSecret.redirect_uris[0]
);

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// Route to start OAuth flow
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

// OAuth2 callback route to get refresh token
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    // Save the refresh token for future use
    fs.writeFileSync('refresh_token.json', JSON.stringify(tokens));
    res.send('Authorization successful! You can close this window.');
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.send('Error retrieving access token');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
