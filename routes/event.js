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
      const userId = req.session.user._id;
      let userEqualsCreator = false;
      if (result.owner._id.equals(userId)) {
        userEqualsCreator = true;
      }
      let joinedEvent = false;

      for (let i = 0; i < result.attendants.length; i++) {
        if (result.attendants[i].equals(userId)) {
          joinedEvent = true;
        }
      }

      const data = {
        event: result,
        buttonPermission: userEqualsCreator,
        joinedEvent: joinedEvent
      };
      res.render('pages/event/event-detail', data);
    })
    .catch(next);
});

router.get('/:id/json', (req, res, next) => {
  Event.findById(req.params.id)
    .then((results) => {
      res.json(results);
    })
    .catch(next);
});

router.post('/:id/delete', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }
  const userId = req.session.user._id;
  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(404);
    res.render('not-found');
    return;
  }

  Event.findByIdAndRemove(eventId)
    .then(() => {
      res.redirect(`/users/${userId}`);
    })
    .catch(next);
});

router.post('/:id/join', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }

  const userId = req.session.user._id;
  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(404);
    res.render('not-found');
    return;
  }

  Event.findByIdAndUpdate(eventId, {$addToSet: { attendants: userId }})
    .then(() => {
      res.redirect(`/users/${userId}`);
    })
    .catch(next);
});

router.post('/:id/unjoin', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }

  const userId = req.session.user._id;
  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(404);
    res.render('not-found');
    return;
  }

  Event.findByIdAndUpdate(eventId, { $pull: { attendants: userId } })
    .then(() => {
      res.redirect(`/users/${userId}`);
    })
    .catch(next);
});

module.exports = router;
