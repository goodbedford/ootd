var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var LookSchema = new Schema({
  url: {type: String, default:"", required: true },
  createdDate: {type: Date, default: Date.now}
});

var Look = mongoose.model('Look', LookSchema);


module.exports.LookSchema = LookSchema;
module.exports.Look = Look;