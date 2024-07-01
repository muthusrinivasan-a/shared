const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-session-secret', resave: true, saveUninitialized: true }));

// Read the client secret JSON file
const clientSecret = JSON.parse(fs.readFileSync('client_secret.json')).web;

const oauth2Client = new google.auth.OAuth2(
  clientSecret.client_id,
  clientSecret.client_secret,
  clientSecret.redirect_uris[0]
);

// Set the additional URLs
oauth2Client.authUrl = clientSecret.auth_uri;
oauth2Client.tokenUrl = clientSecret.token_uri;
oauth2Client.authProviderCertUrl = clientSecret.auth_provider_x509_cert_url;

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// Root route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Google Calendar Integration</h1><a href="/auth">Authorize</a>');
});

// Function to get OAuth URL
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    auth_uri: oauth2Client.authUrl
  });
  res.redirect(authUrl);
});

// OAuth2 callback route
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken({
      code: code,
      client_id: clientSecret.client_id,
      client_secret: clientSecret.client_secret,
      redirect_uri: clientSecret.redirect_uris[0],
      grant_type: 'authorization_code'
    });
    oauth2Client.setCredentials(tokens);
    req.session.tokens = tokens;
    res.redirect('/calendar');
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.send('Error retrieving access token');
  }
});

// Route to get calendar data
app.get('/calendar', async (req, res) => {
  if (!req.session.tokens) {
    res.redirect('/auth');
    return;
  }

  oauth2Client.setCredentials(req.session.tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
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








const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-session-secret', resave: true, saveUninitialized: true }));

// Read the client secret JSON file
const clientSecret = JSON.parse(fs.readFileSync('client_secret.json')).web;

const oauth2Client = new google.auth.OAuth2(
  clientSecret.client_id,
  clientSecret.client_secret,
  clientSecret.redirect_uris[0]
);

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// Function to get OAuth URL
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

// OAuth2 callback route
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    req.session.tokens = tokens;
    res.redirect('/calendar');
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.send('Error retrieving access token');
  }
});

// Route to get calendar data
app.get('/calendar', async (req, res) => {
  if (!req.session.tokens) {
    res.redirect('/auth');
    return;
  }

  oauth2Client.setCredentials(req.session.tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
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
