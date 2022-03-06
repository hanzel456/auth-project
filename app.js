//jshint esversion:6
require('dotenv').config();  //level 3 auth hiding the secret key created in level 2
const express = require('express');
const app = express();
const ejs =require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/secretsDB');

const userSchema = new mongoose.Schema({
  username: {
    type:String,
    required:true
  },

  password: {
    type:String,
    required:true
  }
});

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);


app.route('/')
.get(function(req,res){
  res.render('home');
});

app.route('/login')
.get(function(req,res){
  res.render('login');
})
.post(function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({username:username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else if(foundUser){
      if(foundUser.password === password){
        res.render('secrets');
      } else{
        res.write('incorrect password');
      }
    } else{
      res.write('user not found');
    }
    res.send();
  });
});

app.route('/register')
.get(function(req,res){
  res.render('register');
})
.post(function(req,res){
  const newUser = new User({
    username:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.get('/logout', function(req,res){
  res.redirect('/3');
});

app.listen(port, function(){
  console.log('server operational');
});
