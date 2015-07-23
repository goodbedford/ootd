var express = require('express'),
    app = express(),
    request = require('request'),
    expect = require('chai').expect,
    _ = require('underscore'),
    db = require('../models/index.js'),
    baseUrl = "http://localhost:3000/api/";



var testUser =  {
  email: "tester@gmail.com",
  username: "two chains",
  password: "test"
};
var testLook = {
  url: "someImg.jpg",
  type: "tops"
}


// //GET LOOKS
// describe("Get /api/looks", function(){
//   it('should return statusCode 200', function(done){
//     request.get(baseUrl + "looks", function(err, res, body){
//       expect(res.statusCode).to.be.equal(200);
//       _.each(body, function(look){
//         console.log(look.url);
//       });

//       console.log("this is body",body);
//       done();
//     });
//   });
// });


//POST api/users
describe("POST /api/users", function(){
  it('should return statusCode 201', function(done){
    request.post(baseUrl + "users/", {form: testUser}, function(err, res, body){
      console.log("Post api/users--body--", body);
      testUser = body;
      done(); 
    });
  });
});



//POST
describe("POST /api/users/:id/favs/all", function(){
  it('should return statusCode 201', function(done){
    request.post(baseUrl + "users/"+ testUser._id + "/favs/all", function(err, res, body){
      testLook = body;
      console.log(body);
      done();
    });
  });
});
//PUT
describe("PUT /api/users/:id/favs/all", function(){
  it('should return statusCode 201', function(done){
    request.post(baseUrl + "users/"+ testUser._id + "/favs/all", {form: testLook}, function(err, res, body){
      
      console.log(body);
      done();
    });
  });
});

//DELETE api/users
describe("DELETE /api/users/:id", function(){
  it('should return statusCode 200', function(done){
    request.post(baseUrl + "users/"+ testUser._id, function(err, res, body){
      console.log("Post api/users--body--", body);
      done(); 
    });
  });
});