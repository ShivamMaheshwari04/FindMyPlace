var express = require('express');
var router = express.Router();

router.get('/logout', (req, res) => {
    // Clear session data
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error clearing session');
        }
        res.redirect('/'); // Redirect to login or another page after clearing session
    });// onto the history stack, effectively preventing the user from going back

});
module.exports = router;