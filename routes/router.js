var express = require('express');
var router = express.Router();

let companyRoute = require('./companyRouter');

/* GET users listing. */
router.post('/createCompany',companyRoute.createCompany);


module.exports = router;
