const express = require("express");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const mongoose = require("mongoose");

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

const app = express();
app.set('view engine', 'ejs');
app.set("views", 'views');
app.use(express.urlencoded({ extended : true }));

app.get('/', (req, res) => {
  res.render("home");
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login/auth' , async (req, res) => {
  const user = await User.findOne({'username' : req.body.username});
  let isUser = await bcrypt.compare(req.body.password, user.password);
  if (isUser) {
    res.send("You are logged in !!!");
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
  let pw = await bcrypt.hash(password, 12);
  //save new user to db
  const newUser = new User({'username' : username ,'password' :  pw});
  await newUser.save();
  res.redirect("/home");
} catch(err) {
  next(err);
}
})

app.get("/secret", (req, res) => {
  res.send("THIS IS SECRET ! YOU CANNOT SEE ME UNLESS YOU ARE LOGGED IN !")
})

app.use(errorHandler);

app.listen(3000, (req, res) => {
  console.log("server running on port 3000");
})