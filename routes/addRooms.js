var express = require('express');
var router = express.Router();
var connection = require('../Database/dbConnect'); // Assuming you have a file for DB connection
var r_id;


/* GET About Us page and prepare for service addition */
router.get('/add-rooms', function(req, res, next) {
    const managePg = req.app.locals.managePg;
    var isLoggedIn = false;
    if (req.session.username) {
        isLoggedIn = true;
        const owner_id = userData.id; // Retrieve owner_id from the session

        if (!owner_id) {
            res.status(401).send('Unauthorized'); // Handle unauthorized access
            return;
        }

        if (!managePg) {
            return res.render('./Alerts/Failure.ejs', { message: 'No PG data available.' });
          }

        // Fetch pg_id from the database
        const query = "SELECT r_id FROM findmyplace.rooms ORDER BY r_id DESC LIMIT 1";
        connection.query(query, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('Database Error');
                return;
            }

            // Generate the next s_id for the new service
            if (results.length > 0) {
                const lastPgId = results[0].r_id;
                const numericPart = parseInt(lastPgId.substring(1), 10);
                const nextNumericPart = numericPart + 1;
                r_id = "R" + nextNumericPart.toString().padStart(2, "0");
            } else {
                r_id = "R01"; // Default value if no previous s_id found
            }

            // Render the Add Services page with owner_id and generated s_id
            res.render('Dashboards/Options/AddRooms', { owner_id, r_id,managePg, isLoggedIn });
        });
    }
});

/* POST Add Service route */
router.post('/add-rooms', (req, res) => {
    const owner_id = userData.id;// Retrieve owner_id from the session
    const data = req.body;
    console.log(data);
    console.log(owner_id);

    // Check if owner_id is available
    if (!owner_id) {
        res.status(401).send('<script>alert("Unauthorized Access!! Please refresh and try again.");</script>');
        return;
    }

        // Insert the service into the database
        const queryInsert = "INSERT INTO findmyplace.rooms (r_id, pg_id, Availability, room_type, rent, r_status, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
        // let status = "Active";
        connection.query(queryInsert, [r_id, data.pg_id, data.Availability, data.room_type, data.rent, "Active", data.description], (err, results) => {
            if (err) {
                console.error('Error inserting service:', err);
                res.send('<script>alert("Internal Server Error");</script>');
                return;
            }

            // Service inserted successfully, render the success page
            console.log('Service inserted successfully:', results);
            res.render('./Alerts/ListingCreated');
        });
    });

module.exports = router;
