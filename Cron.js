const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment'); // For parsing and formatting dateTime

const app = express();

// Enable CORS
app.use(cors());

// Parse incoming form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SMTP transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.xxxxx.com',
  port: 25, // Port 25 (non-authenticated SMTP)
  secure: false,
  auth: {
    user: '', // No username
    pass: ''  // No password
  },
  tls: {
    rejectUnauthorized: false // Since TLS is not enabled
  }
});

// Route to handle form submission
app.post('/send-email', (req, res) => {
  const { name, email, message, isScheduled, dateTime } = req.body;

  // Validate the required parameters
  if (isScheduled && dateTime) {
    // Parse dateTime to a cron format
    const scheduleDate = moment(dateTime);
    if (!scheduleDate.isValid()) {
      return res.status(400).json({ error: 'Invalid dateTime format' });
    }

    // Convert dateTime to a cron expression
    const cronExpression = `${scheduleDate.minute()} ${scheduleDate.hour()} ${scheduleDate.date()} ${scheduleDate.month() + 1} *`;

    // Schedule the email
    cron.schedule(cronExpression, () => {
      console.log(`Scheduled email task running for ${email} at ${dateTime}`);

      // Create the email options
      const mailOptions = {
        from: '"Website Contact" <no-reply@example.com>', // Sender
        to: email, // Recipient
        subject: `Scheduled Email from ${name}`, // Subject
        html: `
          <h1>Scheduled Email</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error('Error sending scheduled email:', error);
        }
        console.log('Scheduled email sent:', info.response);
      });
    }, {
      scheduled: true,
      timezone: "America/New_York" // Replace with your desired timezone
    });

    return res.status(200).json({ message: `Email scheduled for ${dateTime}` });

  } else {
    // Send the email immediately if not scheduled
    const mailOptions = {
      from: '"Website Contact" <no-reply@example.com>', // Sender
      to: 'recipient@example.com', // Recipient
      subject: `New Contact Form Submission from ${name}`, // Subject
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send email' });
      }
      return res.status(200).json({ message: 'Email sent successfully!' });
    });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
