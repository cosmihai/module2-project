'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');

router.get('/new', (req, res, next) => {
  res.render();
});
