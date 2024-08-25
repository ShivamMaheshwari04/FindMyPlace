var express = require('express');
var router = express.Router();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
/* GET home page. */
router.get('/', function(req, res, next) {
  var isLoggedIn = false;
  if (req.session.username) {
    isLoggedIn = true;
    res.render('Home',{isLoggedIn});
    // res.send(`Hello, ${req.session.username}`);
} else {
    // res.send('No username stored in session');
    res.render('Home',{isLoggedIn})
  }
  // res.render('Home',{isLoggedIn})
});

module.exports = router;
