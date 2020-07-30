const connection = require('./connection');
const { ObjectId } = require('mongodb');

const findById = async (saleId) => {
  if (!ObjectId.isValid(saleId)) return null;

  const sale = await connection()
    .then((db) => db.collection('sales').findOne(ObjectId(saleId)));

  if (!sale) return null;

  const { _id: id, products } = sale;
  return { id, products };
};

const create = async (saleData) => (
  connection()
    .then((db) => db.collection('sales').insertOne({ products: saleData }))
    .then((result) => ({ id: result.insertedId, products: saleData }))
);

const getAll = async () => (
  connection()
    .then((db) => db.collection('sales').find().toArray())
    .then((sales) => sales.map(({ _id, products }) => ({
      id: _id,
      products,
    })))
);

const remove = async (id) => (
  connection()
    .then((db) => db.collection('sales').removeOne({ _id: ObjectId(id) }))
);

const update = async (id, saleData) => (
  connection()
    .then((db) => db.collection('sales').updateOne(
      { _id: ObjectId(id) },
      { $set: { products: saleData } },
    ))
    .then(() => ({ id, products: saleData }))
);

module.exports = {
  create,
  getAll,
  findById,
  remove,
  update,
};
