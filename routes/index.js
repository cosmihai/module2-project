'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Event = require('../models/event');

/* GET home page. */
router.get('/', (req, res, next) => {
  Event.find()
    .then((result) => {
      const data = {
        event: result
      };
      res.render('pages/homepage', data);
    })
    .catch(next);
});

module.exports = router;
