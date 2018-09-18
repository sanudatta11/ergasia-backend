var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
var cors = require('cors');
var logger = require('morgan');
var mongoose = require('mongoose');
var router = require('./routes/router');
let userRoute = require('./routes/userRoute');

var app = express();
var server = require('http');
let swaggerDocument = require('./docs/ergasiaDoc');
// database connection
let options = {
    useNewUrlParser: true
};


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://admin:CubWvUP7Z76WdaDm@ds046677.mlab.com:46677/ergasia', options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('We\'re connected!');
});
app.use(cors());
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/loginRecruiter',userRoute.loginRecruiter);
app.post('/createUserRecruiter',userRoute.createUserRecruiter);
app.use('/api',router);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// catch 404 and forward to error handler -- Error Handler Rest API
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err);
});


var port = process.env.port || 8000;
var backend = server.createServer(app).listen(port,'0.0.0.0');

module.exports = app;
