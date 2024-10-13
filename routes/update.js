// Import required modules
var express = require('express');
var router = express.Router();
var connection = require('../Database/dbConnect');
const bodyParser = require('body-parser');

// Middleware for parsing form data and JSON
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Route to handle the room update
router.post('/update', async (req, res) => {
    // Extract form data from the request body
    const { r_id, room_type, rent, description, availability } = req.body;

    // SQL query to update room data based on room ID
    const sql = `UPDATE rooms  SET room_type = ?, rent = ?, description = ?, availability = ? WHERE r_id = ?`;

    // Execute the query
    connection.query(sql, [room_type, rent, description, availability, r_id], (err, result) => {
        if (err) {
            console.error('Error updating room data:', err);
            // return res.status(500).send('Error updating room data.');
            res.render('./Alerts/Failure.ejs');
        }
        console.log('Room data updated successfully:', result);
        res.render('./Alerts/UpdateSuccess.ejs');
        // Optionally, you can redirect or render a success message
        // res.redirect('/manage-rooms');  // Assuming you have a route that shows all rooms
    });
});

router.get('/cancel/:bookingId', async (req, res) => {
    // Extract form data from the request body
    const bookingId = req.params.bookingId;

    // SQL query to update room data based on room ID
    const sql = `UPDATE booking  SET b_status = 'Cancelled' WHERE b_id = "${bookingId}"`;

    // Execute the query
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error updating room data:', err);
            // return res.status(500).send('Error updating room data.');
            res.render('./Alerts/Failure.ejs');
        }
        console.log('Booking updated successfully:', result);
        res.render('./Alerts/UpdateSuccess.ejs');
        // Optionally, you can redirect or render a success message
        // res.redirect('/manage-rooms');  // Assuming you have a route that shows all rooms
    });
});

router.get('/done/:bookingId', async (req, res) => {
    // Extract form data from the request body
    const bookingId = req.params.bookingId;

    // SQL query to update room data based on room ID
    const sql = `UPDATE booking  SET b_status = 'Confirmed' WHERE b_id = "${bookingId}"`;

    // Execute the query
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error updating room data:', err);
            // return res.status(500).send('Error updating room data.');
            res.render('./Alerts/Failure.ejs');
        }
        console.log('Booking updated successfully:', result);
        res.render('./Alerts/UpdateSuccess.ejs');
        // Optionally, you can redirect or render a success message
        // res.redirect('/manage-rooms');  // Assuming you have a route that shows all rooms
    });
});

router.post('/submitFeedback', async (req, res) => {
    // Feedback ID Generator
    function feedbackIdGenerator() {
        return new Promise((resolve, reject) => {
            const query = "SELECT f_id FROM findmyplace.feedback ORDER BY f_id DESC LIMIT 1";
            
            connection.query(query, (err, results) => {
                if (err) {
                    reject('Database Error');
                    return;
                }

                // Generate the next f_id for the new feedback
                if (results.length > 0) {
                    const lastFId = results[0].f_id;
                    const numericPart = parseInt(lastFId.substring(1), 10); // Extract the numeric part from 'FXX'
                    const nextNumericPart = numericPart + 1;
                    const nextFId = "F" + nextNumericPart.toString().padStart(2, "0");
                    resolve(nextFId);
                } else {
                    resolve("F01"); // Default value if no previous f_id found
                }
            });
        });
    }

    try {
        // Get the next feedback ID
        const newFeedbackId = await feedbackIdGenerator();

        // Insert the feedback into the database
        const { booking_id, rating, subject, comment } = req.body;
        const insertQuery = `INSERT INTO findmyplace.feedback (f_id, b_id, rating, subject, comments) VALUES (?, ?, ?, ?, ?)`;

        connection.query(insertQuery, [newFeedbackId, booking_id, rating, subject, comment], (err, result) => {
            if (err) {
                console.log(err);
                res.render('./Alerts/Failure.ejs');
                // res.status(500).send('Error inserting feedback');
            } else {
                res.render('./Alerts/FeedbckSuccess.ejs');
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating feedback ID');
    }
});



module.exports = router;
