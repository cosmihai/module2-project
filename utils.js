'use strict';
const moment = require('moment');

class Utils {
  // constructor () {
  // }

  formatDate (dateToFormat) {
    const date = moment(dateToFormat).format('MMM Do YYYY');
    return date;
  }
}

module.exports = Utils;
