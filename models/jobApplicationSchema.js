var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var jobAppSchema = new Schema({
        "name":{
            type: String,
            required: true
        },
        "companyId" : {
            type: ObjectId,
            required: true,
            ref: 'Company'
        },
        "questions" : [{
            type: ObjectId,
            ref : 'Question'
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('JobApp', jobAppSchema);