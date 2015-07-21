
var express = require("express"),
    cors = require("cors"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    session = require('express-session'),
    db = require('./models/index.js'),
    _ = require("underscore"),
    corsOptions = {
          origin: 'http://localhost:3000'
    };

  // var looks =[
  //     { url: "http://topmodafemei.ro/wp-content/uploads/2014/08/outfit6.png",
  //       createdDate: new Date()
  //     },
  //     { url: "http://www.designsnext.com/wp-content/uploads/2014/05/Back-to-School-Outfit-Ideas-4.jpg",
  //       createdDate: new Date()
  //     },
  //     { url: "https://s-media-cache-ak0.pinimg.com/236x/ea/af/95/eaaf95a776e011ee7f877b9daf166193.jpg",
  //       createdDate: new Date()
  //     },
  //     { url: "https://cevalenti.files.wordpress.com/2013/08/casual-outfits-51.jpg",
  //       createdDate: new Date()
  //     }
  // ]

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
  secret: 'OurSuperSecretCookieSecret',
}));

app.use('/', function(req, res, next){
  //save userId in session for logged in user
  req.login = function(user){
    req.session.userId = user.id;
  };

  //find current logged in user based on session.userId
  // req.currentUser = function (callback) {
  //   db.User.findOne({_id: req.session.userId}, function(err, user) {
  //     req.user = user;
  //     callback(null, user);
  //   });
  // };

  //destro session.userId
  req.logout = function(){
    req.session.userId = null;
    req.user = null;
  };

  next();
});




// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// // fix use for local
// app.all('/*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/views/index.html');
})

//GET LOOKS /api/looks - from Instagram #ootd
app.get('/api/looks', function(req, res){

});

app.get('/api/users/:id/favs/all', function(req, res){
  console.log("the req params-", req.params.id);
  db.User.findOne({_id: req.params.id}).populate('fav_all').exec(function(err, user){
    console.log("server get user id fav all",user);
    res.json(user);
  });
});

//POST LOOKS /api/users/:id/looks
app.post('/api/users/:id/favs/all', function(req, res){
  console.log("the looks body Id", req.params.id);

  var look = new db.Look({url:req.body.url});
  console.log("this is the look--", look);
  look.save(function(err, look){
    db.User.findOne({_id: req.params.id}, function(err, user){
      user.fav_all.push(look._id);
      user.save(function(err, user){
       res.status(201).json(user);  
      });
    });
  });

});
//GET USER
app.get('/api/users', function(req, res){
  db.User.find({}, function(err, user){
    console.log("user sent", user);
    res.json(user);
  })
})
//POST USER /api/users
app.post('/api/users', function(req, res){
  console.log(req.body)
  tempUser = new db.User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  tempUser.save(function(err, user){
    console.log("saved new user-", tempUser._id);
    req.login(user);
    res.json(user); 
  });

  //res.status(201).json(tempUser);
});

//LOGIN
app.post('/login', function(req, res){
  console.log("login req.body-",req.body);
  db.User.findOne({email: req.body.email}, function(err, user){
    req.login(user);
    res.json(user);
  });
});






app.listen(process.env.PORT || 3000);