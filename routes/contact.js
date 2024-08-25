var express = require('express');
var router = express.Router();

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  var isLoggedIn = false;
  if (req.session.username) {
    isLoggedIn = true;
    res.render('Other Pages/contact',{isLoggedIn});
    // res.send(`Hello, ${req.session.username}`);
} else {
    // res.send('No username stored in session');
    res.render('Other Pages/contact',{isLoggedIn})
  }
  // res.render('contact'); // File name in the views folder
});

module.exports = router;