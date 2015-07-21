var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    //LookSchema = require('./look.js'),
    Look = require('./look.js'),
    ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
  username: {type: String, default: "", required: true},
  email: {type: String, default: "", required: true},
  password: {type: String, default:"", required: true},
  fav_all: [{type: ObjectId, ref: 'Look'}],
  fav_tops: [{type: ObjectId, ref: 'Look'}],
  fav_legs: [{type: ObjectId, ref: 'Look'}],
  fav_shoes: [{type: ObjectId, ref: 'Look'}],
  fav_pieces: [{type: ObjectId, ref: 'Look'}],

  created:{type:Date, default: Date.now}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;