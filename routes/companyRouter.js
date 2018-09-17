var express = require('express');
var router = express.Router();

let Company = require('../models/companySchema');
let JobApp = require('../models/jobApplicationSchema');
let JobSubmission = require('../models/jobSubmissionsSchema');
let Question = require('../models/questionSchema');
let Applicant = require('../models/applicantSchema');

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
        about: req.body.about,
        companyId : req.body.companyId,
        questions : req.body.questions
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
    JobApp.find({},function (err,data) {
        console.log(data);
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
                "userId" : req.userId || req.body.userId,
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

router.getQuestions = (req,res,next) => {
    Question.find({},function (err,data) {
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

router.createQuestions = (req,res,next) => {
    let question = new Question({
        question : req.body.question
    });

    question.save(function (err,data) {
        if(err)
            res.status(500).json(err);
        else if(!data)
            res.status(404).json({
                info : "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};

router.getAllApplicants = (req,res,next) => {
    JobSubmission.find({
        companyId : req.body.companyId
    },function (err,data) {
        if(err)
            res.status(500).json(err);
        else if(!data)
            res.status(404).json({
                info : "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};

router.selectApplicant = (req,res,next) => {
    let submissionId = req.params.subId;
    JobSubmission.findById(submissionId,function (err,data) {
        if(err)
            res.status(500).json(err);
        else if(!data)
            res.status(404).json({
                info : "Data not found!"
            });
        else
        {
            data.status = 3;
            data.save(function (err,data) {
                if(err)
                    res.status(500).json(err);
                else if(!data)
                    res.status(404).json({
                        info : "Data not found!"
                    });
                else
                    res.status(200).json(data);
            });
        }
    });
};

router.rejectApplicant = (req,res,next) => {
    let submissionId = req.params.subId;
    JobSubmission.findById(submissionId,function (err,data) {
        if(err)
            res.status(500).json(err);
        else if(!data)
            res.status(404).json({
                info : "Data not found!"
            });
        else
        {
            data.status = 2;
            data.save(function (err,data) {
                if(err)
                    res.status(500).json(err);
                else if(!data)
                    res.status(404).json({
                        info : "Data not found!"
                    });
                else
                    res.status(200).json(data);
            });
        }
    });
};

router.jobsApplied = (req,res,next) => {
    JobSubmission.find({
        userId: req.userId || req.body.userId
    },function (err,data) {
        if(err)
            res.status(500).json(err);
        else if(!data)
            res.status(404).json({
                info : "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};


router.completeProfile = (req,res,next) => {
    let imgUrl = req.body.imgUrl;
    let resume = req.body.resume;
    let github = req.body.github;
    let linkedIn = req.body.linkedIn;
    let fiverr = req.body.fiverr;
    let codeforces = req.body.codeforces;
    let codechef = req.body.codechef;
    let behance = req.body.behance;
    let deviantArt = req.body.deviantArt;
    let codepen = req.body.codepen;
    if(!imgUrl)
        res.status(300).json({
            info : "Img is mandatory!"
        });
    else{
        Applicant.findById(req.body.userId,function (err,data) {
            if(err)
                res.status(500).json(err);
            else if(!data)
                res.status(404).json({
                    info : "Data not found!"
                });
            else
            {
                data.imgUrl = imgUrl;
                if(resume)
                    data.resume = resume;
                if(github)
                    data.github = github;
                if(linkedIn)
                    data.linkedIn = linkedIn;
                if(fiverr)
                    data.fiverr = fiverr;
                if(codeforces)
                    data.codeforces = codeforces;
                if(codechef)
                    data.codechef = codechef;
                if(behance)
                    data.behance = behance;
                if(deviantArt)
                    data.deviantArt = deviantArt;
                if(codepen)
                    data.codepen = codepen;

                data.save(function (err,data) {
                    if(err)
                        res.status(500).json(err);
                    else if(!data)
                        res.status(404).json({
                            info : "Data not saved!"
                        });
                    else
                        res.status(200).json(data);
                });
            }
        });
    }
};

router.isCompleteProfile = (req,res,next) => {
  Applicant.findById(req.params.userId,function (err,data) {
      if(err)
          res.status(500).json(err);
      else if(!data)
          res.status(404).json({
              info : "Data not found!"
          });
      else
      {
          if(data.imgUrl && data.github)
              res.status(200).json(data);
          else
              res.status(300).json(data);
      }
  });
};
module.exports = router;
