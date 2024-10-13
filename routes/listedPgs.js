var express = require('express');
var router = express.Router();
var connection = require('../Database/dbConnect'); 

/* GET PG Listing page */
router.get('/pg-listing', function(req, res, next) {
  // Determine if user is logged in
  const isLoggedIn = !!req.session.username; // Converts to boolean

  // Call findListings and pass req, res, and isLoggedIn
  findListings(isLoggedIn, req, res);
  
  function findListings(isLoggedIn, req, res) {
    const sql = `SELECT pd.*, o.o_name, o.o_email, IFNULL(room_counts.available_rooms_count, 0) AS available_rooms_count FROM pg_details pd  JOIN owner o ON pd.Owner_id = o.Owner_id  LEFT JOIN (SELECT r.pg_id, COUNT(r.r_id) AS available_rooms_count FROM rooms r GROUP BY r.pg_id HAVING SUM(r.availability) > 0) AS room_counts ON pd.pg_id = room_counts.pg_id;`;
    
    connection.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send('Database Error');
      }
  
      // Assign results to allListings
      const allListings = results;
      
      // Store the results in app.locals for access across other routes (if necessary)
      req.app.locals.allListings = allListings;
      
      console.log('These are all Listings in Listed PGs: ', allListings);
  
      // Render the page with the listings and isLoggedIn status
      res.render('Dashboards/Options/listedPg', { allListings, isLoggedIn });
    });
  }
});

// Get listing details by ID
router.get('/listing/:id', function(req, res) {
  const listingId = req.params.id;
  let feedback =[]; // Get the listing ID from the URL
  const sql = `
      SELECT pg.*, r.* 
      FROM findmyplace.pg_details AS pg 
      LEFT JOIN findmyplace.rooms AS r ON pg.pg_id = r.pg_id 
      WHERE pg.pg_id = ?`;

      const getPgDetails = async (listingId) => {
        const query = `
            SELECT b.user_id,f.f_id, f.rating, f.subject, f.comments 
            FROM findmyplace.feedback AS f 
            JOIN findmyplace.booking AS b ON f.b_id = b.b_id 
            JOIN findmyplace.rooms AS r ON b.r_id = r.r_id 
            JOIN findmyplace.pg_details AS pg ON r.pg_id = pg.pg_id 
            WHERE pg.pg_id = ?;
        `;
    
        // Return a promise for the query
        return new Promise((resolve, reject) => {
            connection.query(query, [listingId], (error, results) => {
                if (error) {
                    return reject(error); // Reject in case of error
                }
                resolve(results); // Resolve the promise with results
            });
        });
    };

    // Async function to use the query result in a variable
const fetchPgDetails = async () => {
  try {  // Example PG ID
      feedback = await getPgDetails(listingId); // Store the results in a variable
      console.log('Feedback data:', feedback);
      // You can now use the `feedback` variable as needed
  } catch (error) {
      console.error('Error fetching PG details:', error);
  }
};

fetchPgDetails(); // Call the function
    
  
    // console.log(g);
  connection.query(sql, [listingId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send('Database Error');
    }
    
    if (results.length === 0) {
      return res.status(404).send('Listing not found');
    }
    
    // Separate PG details and room details
    const listing = results; // Get the first result which has PG details
    // const roomDetails = results.map(row => ({
      //     room_id: row.r_id, // Assuming room_id is the primary key of the rooms table
      //     room_type: row.room_type,
      //     rent: row.rent,
      //     description: row.description,
      //     // Add other relevant fields from the rooms table here
      // }));
      // console.log(listing);
  
      res.render('Dashboards/Options/detailListing', {feedback, listingId,listing, isLoggedIn: !!req.session.username }); // Pass room details to the detail page
  });
});


module.exports = router;
