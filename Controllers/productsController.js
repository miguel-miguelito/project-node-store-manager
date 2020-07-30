const express = require('express');
const rescue = require('express-rescue');
const boom = require('boom');
const productsModel = require('../Models/productsModel');
const productValidator = require('../Middlewares/productValidator');

const router = express.Router();

router.post('/', productValidator, rescue(async (req, res, next) => {
  const { name, quantity } = req.body;

  const nameAlreadyExists = await productsModel.findByName(name);
  if (nameAlreadyExists) {
    return next(boom.conflict('Produto já existe', 'name'));
  }

  const newProduct = await productsModel.create(name, quantity);

  return res.status(201).json({
    message: 'Produto criado com sucesso!',
    createdProduct: newProduct,
  });
}));

router.get('/', rescue(async (_req, res, _next) => {
  const products = await productsModel.getAll();

  if (products.length === 0) {
    return res.status(200).json({
      message: 'Não há produtos cadastrados ainda',
      products,
    });
  }

  return res.status(200).json({ products });
}));

router.get('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;

  const product = await productsModel.findById(id);

  if (!product) {
    return next(boom.notFound('Produto não encontrado'));
  }

  return res.status(200).json({ product });
}));

router.delete('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;

  const product = await productsModel.findById(id);

  if (!product) {
    return next(boom.notFound('Produto não encontrado'));
  }

  await productsModel.remove(id);

  return res.status(200).json({
    message: 'Produto deletado com sucesso!',
    deletedProduct: product,
  });
}));

router.put('/:id', productValidator, rescue(async (req, res, next) => {
  const { id } = req.params;

  const product = await productsModel.findById(id);

  if (!product) {
    return next(boom.notFound('Produto não encontrado'));
  }

  const { name, quantity } = req.body;
  const nameAlreadyExists = await productsModel.findByName(name, id);

  if (nameAlreadyExists) {
    return next(boom.conflict('Produto já existe', 'name'));
  }

  const updatedProduct = await productsModel.update(id, name, quantity);

  return res.status(200).json({
    message: 'Produto atualizado com sucesso!',
    updatedProduct,
  });
}));

module.exports = router;
