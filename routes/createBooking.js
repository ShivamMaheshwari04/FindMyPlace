var express = require('express');
var router = express.Router();
var connection = require('../Database/dbConnect');  // Database connection

let b_id, r_id;

// Define the route for booking with dynamic room ID (r_id in this case)
router.get('/book/:roomId/:ownerId', function (req, res, next) {
  const roomId = req.params.roomId;  // Extract the r_id (room ID) from the URL
  const OwnerId = req.params.ownerId;  // Extract the r_id (room ID) from the URL
  // console.log(`Fetching details for room_id: ${roomId}`);

  if (!req.session.username) {
    return res.render('./Alerts/LoginFirst.ejs');
  }
  if (req.session.username === OwnerId) {
    return res.render('./Alerts/NotAuthorize.ejs');
  }
  

  // Query the database to join pg_details, Owner, and rooms tables
  const query = `SELECT rooms.*, pg_details.*, Owner.owner_id, Owner.o_email FROM findmyplace.pg_details INNER JOIN findmyplace.Owner ON pg_details.owner_id = Owner.Owner_id  INNER JOIN findmyplace.rooms ON rooms.pg_id = pg_details.pg_id  WHERE rooms.r_id = ?;`

  // Execute the SQL query
  connection.query(query, [roomId], function (err, result) {

    r_id = roomId;
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server Error');
    }

    if (result.length > 0) {
      // Render the 'booking' page and pass the joined data along with user_id and room_id
      res.render('Dashboards/Options/booking', { details: result[0], user_id: req.session.username, roomId });
    } else {
      res.status(404).send('Room not found');
    }
  });

});

// Function to generate the next booking ID
function createBookingID() {
  return new Promise((resolve, reject) => {
    const query = "SELECT b_id FROM findmyplace.booking ORDER BY b_id DESC LIMIT 1";
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        // Generate the next b_id for the new booking
        if (results.length > 0) {
          const lastBId = results[0].b_id;
          const numericPart = parseInt(lastBId.substring(1), 10);
          const nextNumericPart = numericPart + 1;
          const newBId = "B" + nextNumericPart.toString().padStart(2, "0");
          resolve(newBId);
        } else {
          resolve("B01"); // Default value if no previous b_id found
        }
      }
    });
  });
}

// POST route to handle booking submission
router.post('/book/:roomId', async function (req, res) {
  try {
    // Wait for booking ID to be generated
    const newBId = await createBookingID();
    console.log(newBId);

    const r_id = req.params.roomId; // Get the r_id from the request parameters
    const user_id = req.session.username; // Get user_id from session (not from req.body)
    const { phoneNo, b_date, stayTime, b_amount } = req.body; // Extract other form data from the request body

    // SQL query to insert booking data into the booking table
    const query = `INSERT INTO booking (b_id, r_id, user_id, u_number, b_amount, b_date, stayTime, b_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute the query with the form data
    connection.query(query, [newBId, r_id, user_id, phoneNo, b_amount, b_date, stayTime, 'Pending'], function (err, result) {
      if (err) {
        console.error('Error inserting booking:', err);
        return res.status(500).send('Server Error');
      }
      res.render('./Alerts/Booking.ejs');
    });

  } catch (err) {
    console.error('Error generating booking ID:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
