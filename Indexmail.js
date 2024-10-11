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
