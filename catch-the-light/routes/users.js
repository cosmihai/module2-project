'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');

/* GET user profile. */

router.get('/:id', (req, res, next) => {
  if (!req.session.user) {
    return req.redirect('/auth/login');
  }
  const userId = req.params.id;
  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(404);
    res.render('not-found');
    return;
  }
  User.findById(userId)
    .then((result) => {
      console.log('bla');
      if (!result) {
        res.status(404);
        res.render('not-found');
        return;
      }
      const data = {
        user: result
      };
      res.render('pages/user/user', data);
    })
    .catch(next);
});

module.exports = router;
