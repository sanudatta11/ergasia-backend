var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let validator = require('validator');
let async = require('async');
let jwt = require('jsonwebtoken');
let SHA256 = require('sha256-es');
let crypto = require('crypto');

let Recruiter = require('../models/recruiterSchema');
let Applicant = require('../models/applicantSchema');
let Question = require('../models/questionSchema');

router.createUserRecruiter = function (req, res, next) {
    try {
        let firstName = req.body.firstName.toLowerCase();
        let lastName = req.body.lastName.toLowerCase();
        let email = req.body.email.toLowerCase();
        let password = req.body.password.toLowerCase();
        let companyId = req.body.companyId;
        let imgUrl = req.body.imgUrl;
        async.waterfall([
            function (callback) {
                console.log('Data validation and checking');
                if (!(companyId && firstName && lastName && email && password)) {
                    res.status(400).json({
                        info: "Required data attributes not present!"
                    });
                } else {
                    if (companyId && !mongoose.Types.ObjectId.isValid(companyId)) {
                        res.status(400).json({
                            info: "Invalid companyId"
                        });
                    } else {
                        //Validation Check
                        let valid = true;
                        valid = valid && validator.isAlpha(firstName);
                        valid = valid && validator.isAlpha(lastName);
                        valid = valid && validator.isEmail(email);
                        valid = valid && !validator.isEmpty(password);

                        if (!valid)
                            res.status(401).json({
                                info: "Validion of data failed!"
                            });
                        else {
                            callback(null)
                        }
                    }
                }
            },
            function (callback) {
                let hash = crypto.createHash('sha256').update(password).digest('base64');
                Recruiter.findOne({
                    email :  email
                },function(err,data){
                    if(err)
                        res.status(500).json({
                            info : "Problem in searching previous same Recruiter",
                            error:err
                        });
                    else if(data)
                    {
                        res.status(300).json({
                            info : "Email exists"
                        })
                    }
                    else{
                        let userObj = new Recruiter({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            password: hash,
                            companyId: companyId
                        });

                        if (imgUrl)
                            userObj.imgUrl = imgUrl;

                        userObj.save(function (err, data) {
                            if (err)
                                callback(err);
                            else
                                callback(null, data);
                        });
                    }
                });
            }
        ], function (err, result) {
            if (err)
                res.status(500).json({
                    error: err
                });
            else
                res.status(200).json(result);
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(err);
    }
};
//
// router.loginUserApplicant = function (req, res, next) {
//     try {
//         if (req.body.type == "g-auth" && req.body.gAuthToken) {
//             console.log("Inside G-Auth");
//             let token = req.body.gAuthToken;
//             let email = req.body.email;
//             if (!token) {
//                 res.status(304).json({
//                     info: "G-Auth Token Invalid or not Found!"
//                 })
//             }
//             async function verify() {
//                 const ticket = await client.verifyIdToken({
//                     idToken: token,
//                     audience: CLIENT_ID
//                 });
//                 const payload = ticket.getPayload();
//                 const userId = payload['sub'];
//             }
//             verify().catch((err) => {
//                 console.error(err);
//                 res.status(502).json(err);
//             });
//             Applicant.findOne({
//                 email: email,
//             }, function (err, data) {
//                 if (err)
//                     res.status(500).json({
//                         error: err
//                     });
//                 else if (!data)
//                     res.status(404).json({
//                         info: "Data not found"
//                     });
//                 else {
//                     let jwtToken = jwt.sign({
//                         userId: data._id,
//                         userStatus: data.userStatus,
//                         groupId: data.groupId
//                     }, 'supersecret', {
//                         expiresIn: 150000000
//                     });
//
//                     res.status(200).json({
//                         info: "User Login successfull",
//                         token: jwtToken,
//                         groupId: data.groupId,
//                         userId: data._id,
//                         email : data.email
//                     })
//                 }
//             });
//         } else {
//             let email = req.body.email;
//             let password = req.body.password;
//             let hash = crypto.createHash('sha256').update(password).digest('base64');
//             Applicant.findOne({
//                 email: email,
//             }, function (err, data) {
//                 if (err)
//                     res.status(500).json({
//                         error: err
//                     });
//                 else if (!data)
//                     res.status(404).json({
//                         info: "Data not found"
//                     });
//                 else {
//                     if (data.password != hash) {
//                         res.status(400).json({
//                             info: "Password Incorrect",
//                         })
//                     } else {
//                         let jwtToken = jwt.sign({
//                             userId: data._id,
//                             userStatus: data.userStatus,
//                             groupId: data.groupId
//                         }, 'supersecret', {
//                             expiresIn: 150000000
//                         });
//
//                         res.status(200).json({
//                             info: "User Login successfull",
//                             token: jwtToken
//                         })
//                     }
//                 }
//             });
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

router.loginRecruiter = (req,res,next) => {
    let email = req.body.email;
    let password = req.body.password;
    let hash = crypto.createHash('sha256').update(password).digest('base64');
    Recruiter.findOne({
        email: email,
    }, function (err, data) {
        if (err)
            res.status(500).json({
                error: err
            });
        else if (!data)
            res.status(404).json({
                info: "Data not found"
            });
        else {
            if (data.password != hash) {
                res.status(400).json({
                    info: "Password Incorrect",
                })
            } else {
                let jwtToken = jwt.sign({
                    userId: data._id,
                    companyId: data.companyId
                }, 'supersecret', {
                    expiresIn: 150000000
                });

                res.status(200).json({
                    info: "Recruiter Login successfull",
                    token: jwtToken,
                })
            }
        }
    });
};


module.exports = router;