const express = require("express");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/auth-demo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error : '));
db.once("open", () => {
  console.log("Database connected");
})

const app = express();
app.set('view engine', 'ejs');
app.set("views", 'views');

app.get("/register", (req, res) => {
  res.render('register');
})

app.get("/secret", (req, res) => {
  res.send("THIS IS SECRET ! YOU CANNOT SEE ME UNLESS YOU ARE LOGGED IN !")
})


app.listen(3000, (req, res) => {
  console.log("server running on port 3000");
})