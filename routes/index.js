'use strict';

const express = require('express');
const router = express.Router();

const Event = require('../models/event');
const Utils = require('../utils');

const utils = new Utils();

/* GET home page. */
router.get('/', (req, res, next) => {
  Event.find()
    .then((result) => {
      const data = {
        events: result
      };
      for (let i = 0; i < data.events.length; i++) {
        data.events[i].formattedDate = utils.formatDatePartials(result[i].date);
      }
      res.render('pages/homepage', data);
    })
    .catch(next);
});

module.exports = router;
