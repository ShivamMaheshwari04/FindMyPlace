var express = require('express');
var router = express.Router();

/* GET About us page. */
router.get('/aboutUs', function(req, res, next) {
  var isLoggedIn = false;
  if (req.session.username) {
    isLoggedIn = true;
    res.render('Other Pages/about',{isLoggedIn});
} else {
    res.render('Other Pages/about',{isLoggedIn})
  }
});

module.exports = router;
