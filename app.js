//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { userInfo } = require("os");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretsDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/secrets", function(req,res){
    res.render("secrets");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(!err){
            console.log("New User Document inserted successfully");
            res.render("login");
        }
        else
            console.log(err);
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req,res){

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, user){
        if(!err && user){
            if(user.password === password)
                res.render("secrets");
            }
            else{
                console.log(err);
                res.render("login");
            }
    });
});

app.listen(3000, function(){
    console.log("Server has started and is listening on port 3000");
});