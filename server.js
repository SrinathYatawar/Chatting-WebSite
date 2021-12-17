const express= require("express");

const app = express();
const http = require('http').createServer(app);

const Port = process.env.PORT || 3000 ;

http.listen(Port);

const bodyParser = require("body-parser");
require('events').EventEmitter.prototype._maxListeners = 100;


const ejs = require("ejs");
require('dotenv').config()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://young-everglades-57639.herokuapp.com/auth/google/chatpage",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, done) {
 return done(null,profile);
}));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/chatpage', 
  passport.authenticate('google', { failureRedirect: '/signup' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/chatpage');
  });

const io = require("socket.io")(http);

const {userJoin , getCurrentUser, getRoomUser, removeDisconnectUser} = require("./public/user");

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:1}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
});

app.post("/signup",function(req,res){
    res.render("signup");
});

app.post("/chatpage",function(req,res){
  res.render("chatpage",{Name: req.body.Name});
});

app.get("/chatpage",function(req,res){
  res.render("chatpage",{Name: req.body.Username});
});

//socket--
io.on('connection',function(socket){
    socket.on('joinRoom',function(userroomdata){

   const user = userJoin(socket.id,userroomdata.username,userroomdata.roomcode);

          socket.join(user.roomcode);

  //roomUsers code--
     const Users = getRoomUser(user.roomcode);
  io.to(user.roomcode).emit('roomUsers', Users);

          socket.on('message',function(msg){
            socket.broadcast.to(user.roomcode).emit('receive',msg);
           });

          socket.on('disconnect',function(){
            socket.broadcast.to(user.roomcode).emit('offline', user.username);
            removeDisconnectUser(user.id);
            const Users = getRoomUser(user.roomcode);
            io.to(user.roomcode).emit('roomUsers', Users);
          })

    })
    console.log("connected");
});