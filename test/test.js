var express = require('express'),
    app = express(),
    request = require('request'),
    expect = require('chai').expect,
    _ = require('underscore'),
    baseUrl = "http://localhost:3000/api/";


//GET LOOKS
describe("Get /api/looks", function(){
  it('should return statusCode 200', function(done){
    request.get(baseUrl + "looks", function(err, res, body){
      expect(res.statusCode).to.be.equal(200);
      _.each(body, function(look){
        console.log(look.url);
      });

      console.log("this is body",body);
      done();
    });
  });
});




//POST
describe("POST /api/users/:id/favs/all", function(){
  it('should return statusCode 201', function(done){
    request.post(baseUrl + "users/:id/favs/all", function(err, res, body){
      console.log(body);
      done();
    })
  })
})

