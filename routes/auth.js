'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const bcryptSalt = 10;

router.get('/login', (req, res, next) => {
  // if there's already a user logged redirect
  if (req.session.user) {
    res.redirect('/');
  } else {
    const data = { errorMessage: req.flash('login-error') };
    res.render('pages/auth/login', data);
  }
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // check if the form it's empty
  if (username === '' || password === '') {
    req.flash('login-error', 'Indicate a username and a password to sign up');
    res.redirect('/auth/login');
    return;
  }

  // here check if user already exist
  User.findOne({ username: username })
    .then(result => {
      if (!result) {
        req.flash('login-error', 'username can not be found');
        res.redirect('/auth/login');
      } else if (!bcrypt.compareSync(password, result.password)) {
        req.flash('login-error', 'password incorrect');
        res.redirect('/auth/login');
      } else {
        req.session.user = result;
        res.redirect('/');
      }
    })
    .catch(next);
});

router.get('/signup', (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    const data = { errorMessage: req.flash('signup-error') };
    res.render('pages/auth/signup', data);
  }
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // check if the form it's empty
  if (username === '' || password === '') {
    req.flash('signup-error', 'Indicate a username and a password to sign up');
    res.redirect('/auth/signup');
    return;
  }

  // here check if user already exist
  User.findOne({ username: username })
    .then(result => {
      if (result) {
        req.flash('signup-error', 'User already exists');
        res.redirect('/auth/signup');
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const user = new User({
        username,
        password: hashPass
      });

      user.save()
        .then(() => {
          req.session.user = user;
          res.redirect('/');
        })
        .catch(next);
    });
});

// remove the user from the session
router.get('/logout', (req, res, next) => {
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;
