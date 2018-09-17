var express = require('express');
var router = express.Router();



router.createUser = function (req, res, next) {
    try {
        let firstName = req.body.firstName.toLowerCase();
        let lastName = req.body.lastName.toLowerCase();
        let email = req.body.email.toLowerCase();
        let password = req.body.password.toLowerCase();
        async.waterfall([
            function (callback) {
                console.log('Data validation and checking');
                if (!(username && firstName && lastName && email && password && phone && gender && type && userStatus)) {
                    res.status(400).json({
                        info: "Required data attributes not present!"
                    });
                } else {
                    if (groupId && !mongoose.Types.ObjectId.isValid(groupId)) {
                        res.status(400).json({
                            info: "Invalid Group Id"
                        });
                    } else {
                        //Validation Check
                        let valid = true;
                        valid = valid && validator.isAlphanumeric(username);
                        valid = valid && validator.isAlpha(firstName);
                        valid = valid && validator.isAlpha(lastName);
                        valid = valid && validator.isEmail(email);
                        valid = valid && !validator.isEmpty(password);
                        valid = valid && validator.isMobilePhone(phone);
                        valid = valid && validator.isAlpha(gender);
                        valid = valid && validator.isAlpha(type);

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
                if (groupId) {
                    Group.findById(groupId, function (err, data) {
                        if (err)
                            res.status(500).json({
                                error: err
                            });
                        else if (!data)
                            res.status(403).json({
                                info: "No data on the group Id, cannot create User!"
                            });
                        else
                            callback(null);
                    });
                } else
                    callback(null);
            },
            function (callback) {
                let hash = crypto.createHash('sha256').update(password).digest('base64');
                var query = {}
                if (email && username) {
                    query = {
                        $or: [{
                            username: {
                                $regex: username,
                                $options: 'i'
                            }
                        }, {
                            email: {
                                $regex: email,
                                $options: 'i'
                            }
                        }]
                    }
                }

                User.findOne(query,function(err,data){
                    if(err)
                        res.status(500).json({
                            info : "Problem in searching previous same user",
                            error:err
                        })
                    else if(data)
                    {
                        res.status(300).json({
                            info : "Username or email exists"
                        })
                    }
                    else{
                        let userObj = new User({
                            username: username,
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            password: hash,
                            phone: phone,
                            gender: gender,
                            type: type,
                            userStatus: userStatus
                        });

                        if (groupId)
                            userObj.groupId = groupId;

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

router.loginUser = function (req, res, next) {
    try {
        if (req.body.type == "g-auth" && req.body.gAuthToken) {
            console.log("Inside G-Auth");
            let token = req.body.gAuthToken;
            let email = req.body.email;
            if (!token) {
                res.status(304).json({
                    info: "G-Auth Token Invalid or not Found!"
                })
            }
            async function verify() {
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: CLIENT_ID
                });
                const payload = ticket.getPayload();
                const userId = payload['sub'];
            }
            verify().catch((err) => {
                console.error(err);
                res.status(502).json(err);
            });
            User.findOne({
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
                    let jwtToken = jwt.sign({
                        userId: data._id,
                        userStatus: data.userStatus,
                        groupId: data.groupId
                    }, 'supersecret', {
                        expiresIn: 150000000
                    });

                    res.status(200).json({
                        info: "User Login successfull",
                        token: jwtToken,
                        groupId: data.groupId,
                        userId: data._id,
                        email : data.email
                    })
                }
            });
        } else {
            let email = req.body.email;
            let password = req.body.password;
            let hash = crypto.createHash('sha256').update(password).digest('base64');
            User.findOne({
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
                            userStatus: data.userStatus,
                            groupId: data.groupId
                        }, 'supersecret', {
                            expiresIn: 150000000
                        });

                        res.status(200).json({
                            info: "User Login successfull",
                            token: jwtToken,
                            groupId: data.groupId,
                            userId: data._id,
                            email : data.email
                        })
                    }
                }
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = router;