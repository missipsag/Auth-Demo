const express = require("express");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const mongoose = require("mongoose");
const session = require("express-session");


//connect to datebase
mongoose.connect("mongodb://localhost:27017/auth-demo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error : '));
db.once("open", () => {
  console.log("Database connected");
})

//error handling middleware
const errorHandler = function  (err) {
  console.error(err); 
}

//require login middleware
const requireLogin = (req, res, next) => {
  if( ! req.session.user_id) return res.redirect("/login");
  else next();
}

const app = express();

app.set('view engine', 'ejs');
app.set("views", 'views');
app.use(express.urlencoded({ extended : true }));

 const sessionConfig = {
  secret : 'notasogoodsecret',
  resave : false,
  saveUninitialized : true,
  cookie : {
     expires : Date.now() +  1000 * 60 * 60 * 24 * 7,
     maxAge : 1000 * 60 * 60 * 24 * 7, 
     httpOnly : true
   }  
 }
app.use(session(sessionConfig));

app.get('/', (req, res) => {
  res.render("home");
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login/auth' , async (req, res) => {
  const foundUser = await User.findAndValidate(req.body.username, req.body.password);
  if (foundUser) {
    req.session.user_id = foundUser._id;
    res.render("after-login-page");
  } else {
    //if not a user, render the register page
    res.render('register');
  }
})

app.get("/register", (req, res) => {
  res.render('register');
})

app.post("/register", async (req, res, next) => {
 try {
  const { password , username } = req.body;
  const newUser = new User({'username' : username ,'password' :  password});
  await newUser.save();
  res.redirect("/home");
} catch(err) {
  next(err);
}
})

// see if our req.session.user_id is working
app.get("/secret", requireLogin,  (req, res) => {
  res.send("This page is secret !! you can't access it unless you're logged in");
})

app.post("/logout", (req, res ) => {
  req.session.user_id = null;
  res.redirect("/login");
})

app.use(errorHandler);

app.listen(3000, (req, res) => {
  console.log("server running on port 3000");
})