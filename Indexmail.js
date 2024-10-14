const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

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
  const { name, email, message } = req.body;

  // Create the email options
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
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form</title>
</head>
<body>
  <h1>Contact Us</h1>
  <form id="contactForm">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required><br><br>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required><br><br>

    <label for="message">Message:</label>
    <textarea id="message" name="message" required></textarea><br><br>

    <button type="submit">Send</button>
  </form>

  <script>
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch('http://localhost:3000/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        alert(result.message);
      } catch (error) {
        alert('Error sending message');
      }
    });
  </script>
</body>
</html>


const nodemailer = require('nodemailer');

// Create a transporter using the SMTP details
let transporter = nodemailer.createTransport({
  host: 'smtp.xxxxx.com',
  port: 25, // Port 25 (default for non-authenticated SMTP)
  secure: false, // Use false because no SSL/TLS is enabled
  auth: {
    user: '', // No username
    pass: ''  // No password
  },
  tls: {
    rejectUnauthorized: false // Since TLS is not enabled
  }
});

// Define email options
let mailOptions = {
  from: '"Sender Name" <sender@example.com>', // Sender address
  to: 'recipient@example.com',               // List of recipients
  subject: 'Hello from Node.js',              // Subject line
  text: 'This is a test email sent using Node.js and SMTP.', // Plain text body
  // html: '<b>Hello World</b>' // Optional: HTML body if needed
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error:', error);
  }
  console.log('Email sent successfully:', info.response);
});
