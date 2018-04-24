'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');

router.get('/new', (req, res, next) => {
  if (req.session.user) {
    res.render('pages/event/event-create');
  } else {
    res.redirect('/auth/login');
  }
});

router.post('/', (req, res, next) => {
  const userId = req.session.user._id;
  req.body.owner = userId;
  const location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };
  req.body.location = location;
  // req.body.date = new Date(req.body.date);

  const event = new Event(req.body);
  event.save()
    .then(() => {
      res.redirect(`/users/${userId}`);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }

  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(404);
    res.render('not-found');
    return;
  }

  Event.findById(eventId)
    .populate('owner')
    .then((result) => {
      const data = {
        event: result
      };
      res.render('pages/event/event-detail', data);
    })
    .catch(next);
});

module.exports = router;
