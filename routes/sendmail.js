var express = require('express');
var router = express.Router();
const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.Email,
    pass: process.env.PASSWORD,
  }
});

router.post('/sendEmail', (req, res) => {
  const name = req.body.Name;
  const email = req.body.Email;
  const subject = req.body.Subject;
  const description = req.body.description;

  // Log the request body to ensure email and other fields are correctly populated
  console.log('Request Body:', req.body);

  if (!email) {
    console.error('Error: No recipient email defined.');
    res.status(400).send('Bad Request: Missing recipient email.');
    return;
  }

  // Render the EJS template for the admin email
  ejs.renderFile(
    path.join(__dirname, '../views/Contact-Us/adminEmail.ejs'), // Path to your admin EJS file
    { name, email, subject, description }, // Pass dynamic data for the EJS template
    (err, adminHtml) => {
      if (err) {
        console.error('Error rendering admin EJS template:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Render the EJS template for the sender email
      ejs.renderFile(
        path.join(__dirname, '../views/Contact-Us/thankyou.ejs'), // Path to your sender EJS file
        { name, email, subject, description }, // Pass dynamic data for the EJS template
        (err, senderHtml) => {
          if (err) {
            console.error('Error rendering sender EJS template:', err);
            res.status(500).send('Internal Server Error');
            return;
          }

          // Define email content for admin using the rendered HTML
          const mailOptionsToAdmin = {
            from: process.env.Email, // Your email address
            to: 'Shivammaheshwari0401@gmail.com', // Admin email address
            subject: 'New Contact Form Submission',
            html: adminHtml // Use the rendered HTML for the admin email
          };

          // Define email content for the sender using the rendered HTML
          const mailOptionsToSender = {
            from: process.env.Email, // Your email address
            to: email, // Ensure this is not undefined
            subject: 'Thank you for contacting us!',
            html: senderHtml // Use the rendered HTML for the sender email
          };

          // Send email to admin
          transporter.sendMail(mailOptionsToAdmin, function (error, info) {
            if (error) {
              console.error('Error sending email to admin:', error);
              res.status(500).send('Internal Server Error');
            } else {
              console.log('Email sent to admin:', info.response);

              // Send email to sender
              transporter.sendMail(mailOptionsToSender, function (error, info) {
                if (error) {
                  console.error('Error sending email to sender:', error);
                  // Handle error, but do not send error response to avoid confusing the user
                } else {
                  console.log('Email sent to sender:', info.response);
                }
              });

              // Render success page
              res.render('./Alerts/Success.ejs');
            }
          });
        }
      );
    }
  );
});

module.exports = router;
