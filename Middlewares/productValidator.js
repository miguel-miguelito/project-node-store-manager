const boom = require('boom');

const productValidator = async (req, _res, next) => {
  const { name, quantity } = req.body;

  if (typeof name !== 'string' || name.length <= 5) {
    return next(boom.badData('Dados inválidos', 'name'));
  }

  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
    return next(boom.badData('Dados inválidos', 'quantity'));
  }

  return next();
};

module.exports = productValidator;
