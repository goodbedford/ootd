var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    LookSchema = require('./look.js'),
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  username: {type: String, default: "", required: true},
  password: {type: String, default:"", required: true},
  fav_all: [{type: ObjectId, ref: 'LooksSchema'}],
  fav_tops: [{type: ObjectId, ref: 'LooksSchema'}],
  fav_legs: [{type: ObjectId, ref: 'LooksSchema'}],
  fav_shoes: [{type: ObjectId, ref: 'LooksSchema'}],
  fav_pieces: [{type: ObjectId, ref: 'LooksSchema'}],

  created:{type:Date, default: Date.now}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;