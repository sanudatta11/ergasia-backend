var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var applicantSchema = new Schema({
        "email" : {
            type: String,
            required: true,
            unique: true
        },
        "firstName":{
            type: String,
            required: true
        },
        "lastName":{
            type: String,
            required: true
        },
        "about" : {
            type: String,
            required: true
        },
        "imgUrl": {
            type: String
        },
        "resume" : {
            type: String
        },
        "github" : {
            type: String
        },
        "bitbucket" : {
            type: String
        },
        "linkedIn" : {
            type: String
        },
        "fiverr" : {
            type: String
        },
        "upwork" : {
            type: String
        },
        "codeforces" : {
            type: String
        },
        "codechef"  : {
            type: String
        },
        "spoj"  : {
            type: String
        },
        "behance": {
            type: String
        },
        "deviantArt" : {
            type: String
        },
        "codepen" : {
            type: String
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Applicant', applicantSchema);