var express = require('express');
var router = express.Router();
var connection = require('../Database/dbConnect'); // Assuming you have a DB connection module

router.post('/login', (req, res) => {
    const login = req.body;
    const user = login.btnradio;
    // const p_id = login.Username; // Assuming p_id is retrieved from the form

    let query;

    function createConnection() {
        connection.query(query, [login.Username, login.Password], (err, results) => {
            if (err) {
                console.error('Error in database query:', err);
                res.status(500).send('<script>alert("Invalid Data Enter");</script>');
                return;
            }

            if (results.length > 0) {
                const Name = results[0].o_name || results[0].u_name;
                userData = {
                    name: Name,
                    id: results[0].user_id || results[0].Owner_id,
                    user_type: user,
                    token: true,
                    email: results[0].o_email || results[0].u_email,
                    gender: results[0].u_gender || results[0].o_gender,
                    number: results[0].u_phoneNo || results[0].o_contactNo,
                };

                // Store the username in session
                req.session.username = userData.id;
                console.log(req.session.username);

                console.log(results)
                // res.render("Home",{userData});
                res.redirect('/');
                // res.send("Login Successfully");
                // console.log(userData)
                // Render index.ejs and pass userData to it
                // res.render('index.ejs', { userData });
            } else {
                res.render('./Alerts/Warning.ejs');
            }
        });
    }

    if (user.toLowerCase() === "admin") {
        if (login.Username == "admin@123" && login.Password == "admin") {
            userData = {
                name: "admin",
                id: "admin@123",
                user_type: "Admin",
                token: true,
                email: "NA",
                address: "NA",
                number: "NA",
            }
            req.session.username = userData.id;
            res.render('Home.ejs', { userData,isLoggedIn : true });
            // res.send("Login");
        }
        else {
            userData = {
                error: true,
            }
            // res.render('./Alerts/Warning.ejs');
            // return;
            // res.render('index.ejs', { userData })
            console.log("Error")
            userData.error = false;
        }
    }
    else if (user.toLowerCase() === "user") {
        query = `SELECT * FROM ${user.toLowerCase()} WHERE user_id = ? AND u_password = ?`;
        createConnection();
    }
    else {
        query = `SELECT * FROM ${user.toLowerCase()} WHERE Owner_id = ? AND o_password = ?`;
        createConnection();
    }
});
module.exports = router;