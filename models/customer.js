var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    //name: {type: String},
    email: {type: String, required: true},
    token: {type:String, required: true}
});

module.exports = mongoose.model('customer', schema);
