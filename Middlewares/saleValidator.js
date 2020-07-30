const boom = require('boom');
const rescue = require('express-rescue');
const productsModel = require('../Models/productsModel');

const saleValidator = rescue(async (req, _res, next) => {
  if (!Array.isArray(req.body)) {
    return next(boom.badData('Dados inválidos', 'productId'));
  }

  const productIds = req.body.map(({ productId }) => productId);

  const products = await Promise.all(productIds.map((id) => productsModel.findById(id)));

  const productIdsAreValid = products.every((product) => product);
  if (!productIdsAreValid) return next(boom.badData('Dados inválidos', 'productId'));

  const quantitiesAreValid = req.body.every(({ quantity }) => (
    typeof quantity === 'number' && Number.isInteger(quantity) && quantity > 0
  ));

  return quantitiesAreValid ? next() : next(boom.badData('Dados inválidos', 'quantity'));
});

module.exports = saleValidator;
