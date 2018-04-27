'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');
const Utils = require('../utils');

const utils = new Utils();

/* GET user profile. */

router.get('/:id', (req, res, next) => {
  if (!req.session.user) {
    return req.redirect('/auth/login');
  }
  const userId = req.params.id;
  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next();
    return;
  }
  const promiseUser = User.findById(userId);
  const promiseEventCreated = Event.find({owner: userId});
  const promiseEventJoined = Event.find({attendants: {$in: [userId]}});

  Promise.all([promiseUser, promiseEventCreated, promiseEventJoined])
    .then((results) => {
      const user = results[0];
      const eventsCreated = results[1];
      const eventsJoined = results[2];
      // eventCreated.date = moment(eventCreated.date).format();

      const data = {user, eventsCreated, eventsJoined};

      for (let i = 0; i < data.eventsCreated.length; i++) {
        data.eventsCreated[i].formattedDate = utils.formatDatePartials(results[1][i].date);
      }

      for (let i = 0; i < data.eventsJoined.length; i++) {
        data.eventsJoined[i].formattedDate = utils.formatDatePartials(results[2][i].date);
      }
      res.render('pages/user/user', data);
    })
    .catch(next);
});

module.exports = router;
