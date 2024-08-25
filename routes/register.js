var express = require('express');
var router = express.Router();
var connection = require('../Database/dbConnect'); // Assuming you have a DB connection module

// If User Not Exists
var userData = {
    name: null,
    id: null,
    user_type: null,
    token: false,
    emali: null,
    address: null,
    number: null,
    error: false,
}

/* POST register data */
router.post('/register', function(req, res, next) {
    const formData = req.body;
    const user = formData.userCategory;

    let sql;

    // Determine the SQL query based on user category
    if (user.toLowerCase() === "user") {
        sql = `INSERT INTO ${user.toLowerCase()} (user_id, u_name, u_email, u_city, u_State, u_phoneNo, u_gender, u_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    } else {
        sql = `INSERT INTO ${user.toLowerCase()} (Owner_id, o_name, o_email, o_city, o_State, o_contactNo, o_gender, o_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    }

    // Execute the query
    connection.query(sql, [
        formData.Username, 
        formData.Name, 
        formData.Email, 
        formData.City, 
        formData.State, 
        formData.PhoneNo, 
        formData.Gender, 
        formData.Password, 
    ], (err, result) => {
        if (err) {
            res.render('./Alerts/RegisterErr.ejs');
            console.error("Error:", err);
        } else {
            userData ={
                id : formData.Username, 
                name: formData.Name, 
                email: formData.Email, 
                city: formData.City, 
                state: formData.State, 
                number: formData.PhoneNo, 
                gender: formData.Gender, 
                password: formData.Password, 
        };
            console.log("Registration successful : ", result);
            res.redirect('/');
        }
    });
});

module.exports = router;
