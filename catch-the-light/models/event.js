'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const eventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {type: String},
    coordinates: [Number]
  },
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  attendants: {
    type: [ObjectId],
    ref: 'User'
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
eventSchema.index({ location: '2dsphere' });

module.exports = Event;
