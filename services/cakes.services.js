import { client } from '../index.js';

export async function deleteCake(id) {
  return await client.db('Aadithya').collection('cakes').deleteOne({ id });
}
export async function updateCakeById(id, image, itemName, price, description) {
  return await client.db('Aadithya').collection('cakes').updateOne({ id }, { $set: { image, itemName, price, description } });
}
export async function createCake(image, itemName, price, description, id) {
  return await client.db('Aadithya').collection('cakes').insertOne({ image, itemName, price, description, id });
}
export async function getCakeById(id) {
  return await client.db('Aadithya').collection('cakes').findOne({ id });
}
export async function getAllCakes() {
  return await client.db('Aadithya').collection('cakes').find({}).toArray();
}
