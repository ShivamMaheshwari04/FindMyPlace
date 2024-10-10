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

module.exports = router;
