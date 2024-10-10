var express = require('express');
var router = express.Router();
const app = express();
var connection = require('../Database/dbConnect');
const bodyParser = require('body-parser');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
/* GET home page. */
// let managePg;


// Middleware for parsing form data and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/Dashboard', function (req, res, next) {
  var isLoggedIn = false;

  if (req.session.username) {
    isLoggedIn = true;
    if (userData.user_type === "User") {
      res.render('Dashboards/User.ejs', { userData })
    }
    else if (userData.user_type === "Owner") {
      res.render('Dashboards/Owner.ejs', { userData })
      let sql = `SELECT * FROM findmyplace.pg_details where pg_details.owner_id ="${req.session.username}";`;
      let sql1 = `SELECT r.r_id, r.room_type, r.rent,r.r_status, r.availability,r.description, pg.pg_id,pg.Owner_id, pg.pg_name, pg.p_city, pg.p_address FROM rooms AS r JOIN pg_details AS pg ON r.pg_id = pg.pg_id WHERE pg.Owner_id = "${req.session.username}";`
      findPgListing(sql, userData.id);
      findDashboardUserData(sql1)
    }
    else {
      res.render('Dashboards/Admin.ejs', { userData })
      let sql = "SELECT * FROM findmyplace.pg_details;";
      let sql1 = `SELECT r.r_id, r.room_type, r.rent,r.r_status, r.availability,r.description, pg.pg_id,pg.Owner_id, pg.pg_name, pg.p_city, pg.p_address FROM rooms AS r JOIN pg_details AS pg ON r.pg_id = pg.pg_id`
      findPgListing(sql, userData.id);
      findDashboardUserData(sql1)
    }
    // console.log(userData);
    // if()
    res.render();
    // res.send(`Hello, ${req.session.username}`);
  } else {
    // res.send('No username stored in session');
    // res.render('Home',{isLoggedIn})
    res.render('./Alerts/LoginError.ejs');
  }
  // res.render('Home',{isLoggedIn})
  function findPgListing(sql, Owner_id) {
    connection.query(sql, [Owner_id], (err, result) => {
      if (err) {
        console.error("Error in Dashboard :", err);
        // Send the failure response
        return res.render('./Alerts/Failure.ejs'); // Use `return` to prevent further code execution
      }
      req.app.locals.managePg = result;
      // console.log("Dashboard Mai Hai :", result);
      // Send the success response
      // res.render('./Alerts/Success.ejs'); // Only render success or redirect, not both
    });

  }

  // Function to fetch dashboard user data for the logged-in owner
  async function findDashboardUserData(sql) {
    // Create the SQL query to fetch data for the logged-in user
    // Parameterized query for safety

    return new Promise((resolve, reject) => {
      // Execute the query
      connection.query(sql, (err, result) => {
        if (err) {
          console.error("Error fetching dashboard user data:", err);
          return reject(err); // Reject the promise with the error
        }
        req.app.locals.manageRooms = result;
        console.log("Dashboard user data fetched successfully:", result);
        resolve(result); // Resolve the promise with the result
      });
    });
  }

});


module.exports = router;