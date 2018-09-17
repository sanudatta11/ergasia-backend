var express = require('express');
var router = express.Router();

let Company = require('../models/companySchema');

/* GET users listing. */
router.createCompany = (req,res,next) => {
    let companyObj = new Company({
        "name":req.body.name,
        "about" : req.body.about,
        "yearFounded" : req.body.yearFounded,
        "funding" :req.body.funding,
    });

    companyObj.save(function (err,data) {
       if(err)
           res.status(500).json(err);
       else if(!data)
           res.status(404).json({
               info : "Data not saved! not some error"
           })
       else
           res.status(200).json(data);
    });
};

router.getCompany = (req,res,next) => {
    Company.find({},function (err,data) {
        if(err)
            res.status(500).json(err);
        else if(!data)
            res.status(404).json({
                info : "Data not found!"
            })
        else
            res.status(200).json(data);
    });
};

router.createJob = (req,res,next) => {
    
};
module.exports = router;
