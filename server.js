
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
  saveUninitalized: true,
  resave: true,
  secret: 'OurSuperSecretCookieSecret',
}));

app.use('/', function(req, res, next){
  //save userId in session for logged in user
  req.login = function(user){
    req.session.userId = user.id;
  };

  //find current logged in user based on session.userId
  req.currentUser = function (callback) {
    db.User.findOne({_id: req.session.userId}, function(err, user) {
      req.user = user;
      callback(null, user);
    });
  };

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
  res.sendfile('public/views/index.html');
})

//GET LOOKS /api/looks - from Instagram #ootd
app.get('/api/looks', function(req, res){
  //res.redirect("https://api.instagram.com/v1/tags/ootd/media/recent?client_id=6f1ace0e97194e09adbe7c7740d51531");
  //console.log(req.body);
  //res.json(looks);
});

// app.get("https://api.instagram.com/v1/tags/ootd/media/recent?client_id=6f1ace0e97194e09adbe7c7740d51531", function(req, res){
//   res.json(req.body)
// });

//POST LOOKS /api/looks
app.post('/api/users/:id/favs/all', function(req, res){
  var id = req.body.id;
  console.log('The body of post-', req.body);
  var newLookAll = new Look({url: req.body.url});
  newLookAll.save();
  db.User.findOne({_id: id}, function(err, foundUser){
    foundUser.fav_all.push(newLookAll._id);
    foundUser.save();
    res.status(201).json(foundUser);
  });
});

//POST USER /api/users
app.post('/api/users', function(req, res){
  console.log(req.body)
  tempUser = new db.User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  tempUser.save();
  console.log("saved new user-", tempUser._id);
  res.redirect("/login");
  //res.status(201).json(tempUser);
});

//LOGIN
app.post('/login', function(req, res){
  console.log("login req.body-",req.body);
  db.User.findOne({email: req.body.email}, function(err, foundUser){
    req.login(foundUser);

  });
});






app.listen(process.env.PORT || 3000);