var express = require('express');
var router = express.Router();

let Company = require('../models/companySchema');
let JobApp = require('../models/jobApplicationSchema');
let JobSubmission = require('../models/jobSubmissionsSchema');

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
           });
       else
           res.status(200).json(data);
    });
};

router.getCompany = (req,res,next) => {
    Company.find({},function (err,data) {
        if(err)
            res.status(500).json(err);
        else if(!data.length)
            res.status(404).json({
                info : "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};

router.createJob = (req,res,next) => {
    let jobApp = new JobApp({
       name : req.body.name,
        companyId : req.body.companyId,
        questions : req.bpdy.questions
    });

    jobApp.save(function (err,data) {
        if(err)
            res.status(500).json(err);
        else if(!data)
            res.status(404).json({
                info : "Data not saved!"
            });
        else
            res.status(200).json(data);
    });
};

router.getJobs = (req,res,next) => {
    JobApp.find({
        companyId: req.body.companyId
    },function (err,data) {
        if(err)
            res.status(500).json(err);
        else if(!data.length)
            res.status(404).json({
                info : "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};

router.applyjob = (req,res,next) => {
    JobApp.findById(req.body.jobId,function (err,jobAppData) {
        if(err)
            res.status(500).json(err);
        else if(!jobAppData)
            res.status(404).json({
                info : "Data not found!"
            });
        else
        {
            let jobSub = new JobSubmission({
                "companyId" : req.body.companyId,
                "userId" : req.userId,
                "answers" : req.body.answers
            });

            jobSub.save(function (err,data) {
                if(err)
                    res.status(500).json(err);
                else if(!data.length)
                    res.status(404).json({
                        info : "Data not saved!"
                    });
                else
                    res.status(200).json(data);
            });
        }
    });
};



module.exports = router;
