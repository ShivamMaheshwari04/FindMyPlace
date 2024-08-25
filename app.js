const express = require('express');
const app = express();
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const PORT = process.env.PORT || 3001;
// const ejs = require('ejs');
const connection = require('./Database/dbConnect');
const session = require('express-session');

// Routes
var indexRouter = require('./routes/index'); // Home Page
var contactRouter = require('./routes/contact'); // Contact Page
var aboutUsRouter = require('./routes/about'); // About Us Page
var registerRouter = require('./routes/register'); // Register
var loginRouter = require('./routes/login'); // Login
var logoutRouter = require('./routes/logout'); // Logout


// view engine setup


app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'FindMyPlace', // Replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/', indexRouter);
app.use('/', contactRouter);
app.use('/', registerRouter);
app.use('/', loginRouter);
app.use('/', logoutRouter);
app.use('/', aboutUsRouter);
// app.use('/AboutUs', registerRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


// Listening 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connection.connect(function (err) {
    if (err) throw err;
    console.log('Database connected!');
});
});


// module.exports = app;
