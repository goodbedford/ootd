
var express = require("express"),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    session = require('express-session'),
    db = require('./models/index.js'),
    _ = require("underscore"),
    request = require('request'),
    app = express(),
    dotenv = require("dotenv"),
    corsOptions = {
          origin: 'http://localhost:3000'
    };
// var ig = require('instagram-node').instagram();


 dotenv.load();   
    
 // ig.use({client_id: process.env.clientId,
 //         client_secret: process.env.clientSecret}); 
// Connect to Database
mongoose.connect(
    process.env.MONGOLAB_URI || 
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/ootd');

// middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

app.use(cors({credentials: true, origin: true}));

//session
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 600000 }
  
}));  

app.use('/', function(req, res, next){
  //save userId in session for logged in user
  req.login = function(user){
    // console.log("userId_: ",user._id);
    // console.log("user.id: ",user.id);

    req.session.userId = user._id;
    // console.log("sess.userId:", req.session.userId);
  };

  //find current logged in user based on session.userId
  req.currentUser = function (callback) {
    db.User.findOne({_id: req.session.userId}, function(err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  //destroy session.userId
  req.logout = function(){
    req.session.userId = null;
    req.user = null;
  };  

  next();
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/views/index.html');
});

//GET Current User
app.get('/api/current', function(req, res){
  req.currentUser(function(err, user){
    res.json(user);
  });
});
//GET Logout User
app.get('/logout', function(req, res){
  req.logout();
  res.json("logged out");
});
//GET USERS
app.get('/api/users', function(req, res){
  db.User.find({}, function(err, user){
    console.log("user sent", user);
    res.json(user);
  });
});
//POST USER /api/users
app.post('/api/users', function(req, res){
  //console.log(req.body)

  var tempUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };
  db.User.createSecure( tempUser,
    function (err, user){
      res.send(user);
    }
  );
});
//DELETE USER /api/users/:id
app.delete('/api/users/:id', function(req, res){
  db.User.find({_id: req.params.id}, function(err, user){
    console.log("user deleted", user);
    res.send("user was deleted:");
  });
});
//POST LOGIN
app.post('/login', function(req, res){
  console.log("login req.body-",req.body);
  db.User.authenticate(req.body.email, req.body.password, function(err, user){
    req.login(user);
    res.send(user);
  });
});
//GET LOOKS
app.get('/api/looks', function(req,res){

  // ig.tag('ootd', function(err, result, remaining, limit){
  //   console.log("the result", result, "the remaining", remaining);
  //   res.send(result);
  // });
  request.get('https://api.instagram.com/v1/tags/ootd/media/recent?client_id=' + process.env.clientId, function(err,respond, body){
    data = JSON.parse(body);
    //console.log("the body", body);
    console.log("request insta data:", data.data);
    console.log("error:",err);
    res.json(data.data);
  }); 
});

//Delete All LOOKS /api/looks/:id
app.delete('/api/looks/:id', function(req, res){
  req.currentUser(function(err, user){
    if( user){
      console.log("look params id:", req.params.id);
      db.Look.remove({_id: req.params.id}, function(err, look){
        console.log("removed look: ", look);
          res.send("removed look: ");
      });
    }
  });
});

//GET ALL LOOKS /api/users/:id/favs/all
app.get('/api/users/:id/favs/all', function(req, res){
  // console.log("the req params-", req.params.id);
  db.User.findOne({_id: req.params.id}).populate('fav_all').exec(function(err, user){
    console.log("server get user id fav all",user);
    res.json(user);
  });
});

//POST ALL LOOKS /api/users/:id/favs/all
app.post('/api/users/:id/favs/all', function(req, res){
  req.currentUser(function(err, user){
    if( user){
      //console.log("the looks body Id", req.params.id);
      var look = new db.Look({url:req.body.url, type:"all"});
      //console.log("this is the look--", look);
      look.save(function(err, look){
        db.User.findOne({_id: req.params.id}, function(err, user){
          user.fav_all.push(look._id);
          user.save(function(err, user){
            console.log("the user is saved:", user);
            console.log("the look is saved", look);
           res.status(201).json(user);  
          });
        });
      });
    } else{
      console.log("favorite not saved");
    }
  });


});
//PUT ALL LOOKS /api/users/:id/favs/all
app.put('/api/users/:id/favs/all', function(req, res){
    db.User.findOne({_id: req.params.id}, function(err, user){
      var lookId = req.body.lookId;
      var favIndex;
      _.each(user.fav_all, function(look){
        console.log("look id in update: ", lookId);
        if( look == lookId){
          favIndex =  user.fav_all.indexOf(look);
          console.log("favIndex in update: ", favIndex);
          user.fav_all.splice(favIndex, 1);
        }
      });
      user.save(function(err, user){
        console.log("updated user: ", user);
       res.json(user);  
      });
  });
});



//GET TOPS /api/users/:id/favs/tops'
app.get('/api/users/:id/favs/tops', function(req, res){
  console.log("the req params-", req.params.id);
  db.User.findOne({_id: req.params.id}).populate('fav_tops').exec(function(err, user){
    console.log("server get user id fav tops",user);
    res.json(user);
  });
});
//POST TOPS LOOKS /api/users/:id/favs/tops
app.post('/api/users/:id/favs/tops', function(req, res){
  //console.log("the looks body Id", req.params.id);
  var look = new db.Look({url:req.body.url, type:"tops"});
  //console.log("this is the look--", look);
  look.save(function(err, look){
    db.User.findOne({_id: req.params.id}, function(err, user){
      user.fav_tops.push(look._id);
      user.save(function(err, user){
       res.status(201).json(user);  
      });
    });
  });
});
//PUT TOPS LOOKS /api/users/:id/favs/tops
app.put('/api/users/:id/favs/tops', function(req, res){
    db.User.findOne({_id: req.params.id}, function(err, user){
      var lookId = req.body.lookId;
      var favIndex;
      _.each(user.fav_tops, function(look){
        console.log("look id in update: ", lookId);
        if( look == lookId){
          favIndex =  user.fav_tops.indexOf(look);
          console.log("favIndex in update: ", favIndex);
          user.fav_tops.splice(favIndex, 1);
        }
      });
      user.save(function(err, user){
        console.log("updated user: ", user);
       res.json(user);  
      });
    });
});

//GET LEGS /api/users/:id/favs/legs'
app.get('/api/users/:id/favs/legs', function(req, res){
  //console.log("the req params-", req.params.id);
  db.User.findOne({_id: req.params.id}).populate('fav_legs').exec(function(err, user){
    console.log("server get user id fav legs",user);
    res.json(user);
  });
});
//POST LEGS LOOK /api/users/:id/favs/legs
app.post('/api/users/:id/favs/legs', function(req, res){
  // console.log("the legs looks body Id", req.params.id);
  var look = new db.Look({url:req.body.url, type:"legs"});
  //console.log("this is the look--", look);
  look.save(function(err, look){
    db.User.findOne({_id: req.params.id}, function(err, user){
      user.fav_legs.push(look._id);
      user.save(function(err, user){
       res.status(201).json(user);  
      });
    });
  });
});
//PUT LEGS LOOKS /api/users/:id/favs/legs
app.put('/api/users/:id/favs/legs', function(req, res){
    db.User.findOne({_id: req.params.id}, function(err, user){
      var lookId = req.body.lookId;
      var favIndex;
      _.each(user.fav_legs, function(look){
        console.log("look id in update: ", lookId);
        if( look == lookId){
          favIndex =  user.fav_legs.indexOf(look);
          console.log("favIndex in update: ", favIndex);
          user.fav_legs.splice(favIndex, 1);
        }
      });
      user.save(function(err, user){
        console.log("updated user: ", user);
       res.json(user);  
      });
  });
});
//GET SHOES /api/users/:id/favs/shoes'
app.get('/api/users/:id/favs/shoes', function(req, res){
  console.log("the req params-", req.params.id);
  db.User.findOne({_id: req.params.id}).populate('fav_shoes').exec(function(err, user){
    console.log("server get user id fav shoes",user);
    res.json(user);
  });
});
//POST SHOES LOOK /api/users/:id/favs/shoes
app.post('/api/users/:id/favs/shoes', function(req, res){
  //console.log("the shoes looks body Id", req.params.id);
  var look = new db.Look({url:req.body.url, type: "shoes"});
  //console.log("this is the look--", look);
  look.save(function(err, look){
    db.User.findOne({_id: req.params.id}, function(err, user){
      user.fav_shoes.push(look._id);
      user.save(function(err, user){
       res.status(201).json(user);  
      });
    });
  });
});

//GET Pieces /api/users/:id/favs/pieces'
app.get('/api/users/:id/favs/pieces', function(req, res){
  console.log("the req params-", req.params.id);
  db.User.findOne({_id: req.params.id}).populate('fav_pieces').exec(function(err, user){
    console.log("server get user id fav pieces",user);
    res.json(user);
  });
});
//POST Pieces LOOK /api/users/:id/favs/pieces
app.post('/api/users/:id/favs/pieces', function(req, res){
  //console.log("the pieces looks body Id", req.params.id);
  var look = new db.Look({url:req.body.url, type: "pieces"});
  //console.log("this is the look--", look);
  look.save(function(err, look){
    db.User.findOne({_id: req.params.id}, function(err, user){
      user.fav_pieces.push(look._id);
      user.save(function(err, user){
       res.status(201).json(user);  
      });
    });
  });
});
//PUT PIECES LOOKS /api/users/:id/favs/pieces
app.put('/api/users/:id/favs/pieces', function(req, res){
    db.User.findOne({_id: req.params.id}, function(err, user){
      var lookId = req.body.lookId;
      var favIndex;
      _.each(user.fav_pieces, function(look){
        console.log("look id in update: ", lookId);
        if( look == lookId){
          favIndex =  user.fav_pieces.indexOf(look);
          console.log("favIndex in update: ", favIndex);
          user.fav_pieces.splice(favIndex, 1);
        }
      });

      user.save(function(err, user){
        console.log("updated user: ", user);
       res.json(user);  
      });
  });
}); 

app.get("*", function(req, res){
  res.redirect('/');
});








app.listen(process.env.PORT || 3000, function(){
  console.log("server started on localhost: 3000");
});



