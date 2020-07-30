const productValidator = require('./productValidator');
const saleValidator = require('./saleValidator');
const boomErrorHandler = require('./boomErrorHandler');
const otherErrorsHandler = require('./otherErrorsHandler');

module.exports = {
  productValidator,
  saleValidator,
  boomErrorHandler,
  otherErrorsHandler,
};
