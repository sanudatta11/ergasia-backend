var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
        "name":{
            type: String,
            required: true
        },
        "email" : {
            type: String,
            required: true
        },
        "password" : {
            type: String,
            required: true
        },
        "imgUrl" : {
            type : String,
            required: true
        },
        "companyId" : {
            type : ObjectId,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Property', userSchema);