const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Read client secret JSON file
const clientSecret = JSON.parse(fs.readFileSync(path.join(__dirname, 'client_secret.json'))).web;

const oauth2Client = new google.auth.OAuth2(
  clientSecret.client_id,
  clientSecret.client_secret,
  clientSecret.redirect_uris[0] // Ensure this URI matches what is registered in Google Cloud Console
);

// Load refresh token
const refreshToken = JSON.parse(fs.readFileSync('refresh_token.json')).refresh_token;

// Set refresh token
oauth2Client.setCredentials({ refresh_token: refreshToken });

// Route to get calendar data
app.get('/calendar', async (req, res) => {
  try {
    // Refresh the access token
    const accessTokenResponse = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(accessTokenResponse.credentials);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary', // or the email of the calendar shared with the service account
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    if (events.length) {
      res.send(events);
    } else {
      res.send('No upcoming events found.');
    }
  } catch (error) {
    console.error('The API returned an error:', error);
    res.send('The API returned an error.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
