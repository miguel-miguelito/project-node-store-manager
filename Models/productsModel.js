const connection = require('./connection');
const { ObjectId } = require('mongodb');

const findByName = async (productName, productId = null) => {
  const productData = await connection()
    .then((db) => db.collection('products').findOne({
      name: productName,
      _id: { $ne: ObjectId(productId) },
    }));

  if (!productData) return null;

  const { _id, name, quantity } = productData;

  return { id: _id, name, quantity };
};

const findById = async (id) => {
  if (!ObjectId.isValid(id)) return null;

  const productData = await connection()
    .then((db) => db.collection('products').findOne(ObjectId(id)));

  if (!productData) return null;

  const { _id, name, quantity } = productData;

  return { id: _id, name, quantity };
};

const create = async (name, quantity) => (
  connection()
    .then((db) => db.collection('products').insertOne({ name, quantity }))
    .then((result) => ({ id: result.insertedId, name, quantity }))
);

const getAll = async () => (
  connection()
    .then((db) => db.collection('products').find().toArray())
    .then((products) => products.map(({ _id, name, quantity }) => ({
      id: _id,
      name,
      quantity,
    })))
);

const remove = async (id) => (
  connection()
    .then((db) => db.collection('products').removeOne({ _id: ObjectId(id) }))
);

const update = async (id, name, quantity) => (
  connection()
    .then((db) => db.collection('products').updateOne(
      { _id: ObjectId(id) },
      { $set: { name, quantity } },
    ))
    .then(() => ({ id, name, quantity }))
);

module.exports = {
  create,
  getAll,
  findById,
  findByName,
  remove,
  update,
};
