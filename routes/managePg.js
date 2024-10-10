var express = require('express');
var router = express.Router();

/* GET About us page. */
router.get('/manage-pg', function(req, res, next) {
  var isLoggedIn = false;
  if (req.session.username) {
    isLoggedIn = true;
    const managePg = req.app.locals.managePg;
    res.render('Dashboards/Options/managePg',{isLoggedIn,managePg});
} else {
    res.redirect("/");
  }
});

router.get('/manage-rooms', function(req, res, next) {
  var isLoggedIn = false;
  if (req.session.username) {
    isLoggedIn = true;
    const manageRooms = req.app.locals.manageRooms;
    res.render('Dashboards/Options/manageRoom',{isLoggedIn,manageRooms});
} else {
    res.redirect("/");
  }
});

module.exports = router;
