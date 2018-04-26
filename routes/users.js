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
  const promiseUser = User.findById(userId);
  const promiseEventCreated = Event.find({owner: userId});
  const promiseEventJoined = Event.find({attendants: {$in: [userId]}});

  Promise.all([promiseUser, promiseEventCreated, promiseEventJoined])
    .then((results) => {
      const user = results[0];
      const eventCreated = results[1];
      const eventJoined = results[2];

      const data = {user, eventCreated, eventJoined};
      res.render('pages/user/user', data);
    })
    .catch(next);
});

router.get('/user/edit', (req, res, next) => {
  if (!req.session.user) {
    return req.redirect('/auth/login');
  }

  res.render('pages/user/edituser');
});

module.exports = router;
