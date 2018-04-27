'use strict';
const moment = require('moment');

class Utils {
  formatDatePartials (dateToFormat) {
    const date = moment(dateToFormat).format('Do MMM YYYY');
    return date;
  }

  formatDateForms (dateToFormat) {
    const date = moment(dateToFormat).format('YYYY-MM-DD');
    return date;
  }
}

module.exports = Utils;
