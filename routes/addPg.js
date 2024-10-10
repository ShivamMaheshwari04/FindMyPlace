var express = require('express');
var router = express.Router();
var connection = require('../Database/dbConnect'); // Assuming you have a file for DB connection
var s_id;



/* GET About Us page and prepare for service addition */
router.get('/add-pg', function(req, res, next) {
    var isLoggedIn = false;
    if (req.session.username) {
        isLoggedIn = true;
        const owner_id = userData.id; // Retrieve owner_id from the session

        if (!owner_id) {
            res.status(401).send('Unauthorized'); // Handle unauthorized access
            return;
        }

        // Fetch pg_id from the database
        const query = "SELECT pg_id FROM findmyplace.pg_details ORDER BY pg_id DESC LIMIT 1";
        connection.query(query, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('Database Error');
                return;
            }

            // Generate the next s_id for the new service
            if (results.length > 0) {
                const lastPgId = results[0].pg_id;
                const numericPart = parseInt(lastPgId.substring(1), 10);
                const nextNumericPart = numericPart + 1;
                s_id = "A" + nextNumericPart.toString().padStart(2, "0");
            } else {
                s_id = "A01"; // Default value if no previous s_id found
            }

            // Render the Add Services page with owner_id and generated s_id
            res.render('Dashboards/Options/AddPG', { owner_id, s_id, isLoggedIn });
        });
    }
});

/* POST Add Service route */
router.post('/add-pg', (req, res) => {
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
        const queryInsert = "INSERT INTO findmyplace.pg_details (pg_id, owner_id, pg_name, p_city, p_address, p_State, p_contactNo, pincode, pg_type, img_1, img_2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        // let status = "Active";
        connection.query(queryInsert, [s_id, owner_id, data.pg_name, data.city, data.address, data.state, data.contactNo, data.pincode, data.pg_type, data.img_1,data.img_2], (err, results) => {
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
