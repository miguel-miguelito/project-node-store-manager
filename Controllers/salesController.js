const express = require('express');
const rescue = require('express-rescue');
const boom = require('boom');
const salesModel = require('../Models/salesModel');
const saleValidator = require('../Middlewares/saleValidator');

const router = express.Router();

router.post('/', saleValidator, rescue(async (req, res, _next) => {
  const saleData = req.body.map(({ productId, quantity }) => ({ productId, quantity }));

  const newSale = await salesModel.create(saleData);

  return res.status(201).json({
    message: 'Venda criada com sucesso!',
    createdSale: newSale,
  });
}));

router.get('/', rescue(async (_req, res, _next) => {
  const sales = await salesModel.getAll();

  if (sales.length === 0) {
    return res.status(200).json({
      message: 'Não há vendas cadastradas ainda',
      sales,
    });
  }

  return res.status(200).json({ sales });
}));

router.get('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;

  const sale = await salesModel.findById(id);

  if (!sale) {
    return next(boom.notFound('Venda não encontrada'));
  }

  return res.status(200).json({ sale });
}));

router.delete('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;

  const sale = await salesModel.findById(id);

  if (!sale) {
    return next(boom.notFound('Venda não encontrada'));
  }

  await salesModel.remove(id);

  return res.status(200).json({
    message: 'Venda deletada com sucesso!',
    deletedSale: sale,
  });
}));

router.put('/:id', saleValidator, rescue(async (req, res, next) => {
  const { id } = req.params;

  const sale = await salesModel.findById(id);

  if (!sale) {
    return next(boom.notFound('Venda não encontrada'));
  }

  const saleData = req.body.map(({ productId, quantity }) => ({ productId, quantity }));

  const updatedSale = await salesModel.update(id, saleData);

  return res.status(200).json({
    message: 'Venda atualizada com sucesso!',
    updatedSale,
  });
}));

module.exports = router;
