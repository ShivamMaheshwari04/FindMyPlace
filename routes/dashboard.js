var express = require('express');
var router = express.Router();
const app = express();
var connection = require('../Database/dbConnect');
const bodyParser = require('body-parser');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
/* GET home page. */


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
    }
    else {
      res.render('Dashboards/Admin.ejs', { userData })
    }
    console.log(userData);
    // if()
    res.render();
    // res.send(`Hello, ${req.session.username}`);
  } else {
    // res.send('No username stored in session');
    // res.render('Home',{isLoggedIn})
    res.render('./Alerts/LoginError.ejs');
  }
  // res.render('Home',{isLoggedIn})
});

router.post("/edit", function (req, res, next) {
 
  const user = userData.user_type;
  const username = userData.id;
  const formData = req.body;
  let sql = '';
  
  // Create SQL query based on user type
  if (userData.user_type.toLowerCase() === "user") {
    sql = `UPDATE ${user.toLowerCase()} SET u_name = ?, u_email = ?, u_phoneNo = ? WHERE user_id = ?;`;
  } else {
    sql = `UPDATE ${user.toLowerCase()} SET o_name = ?, o_email = ?, o_contactNo = ? WHERE Owner_id = ?;`;
  }

  // Execute the SQL query
  connection.query(sql, [formData.name, formData.email, formData.number, username], (err, result) => {
    if (err) {
      console.error("Error:", err);
      // Send the failure response
      return res.render('./Alerts/Failure.ejs'); // Use `return` to prevent further code execution
    }

    console.log("Update successful:", result);
    // Send the success response
    res.render('./Alerts/Success.ejs'); // Only render success or redirect, not both
  });
});

module.exports = router;